// notify-lead
//
// Triggered by a database webhook AFTER INSERT on public.raiox_leads and
// public.process_leads. Sends an internal notification email for every new
// lead, plus an English auto-reply for X-Ray leads that chose followup = 'email'.
//
// MANUAL SETUP STILL REQUIRED BY THE PROJECT OWNER:
//   1. Create an API key in Resend and save it as the secret RESEND_API_KEY.
//   2. Verify the domain veehtor.com in Resend and set the secret NOTIFY_FROM
//      (e.g. "Veehtor AI <leads@veehtor.com>") so the auto-reply to the lead
//      can be delivered. Without a verified domain, Resend only delivers to
//      the account owner from onboarding@resend.dev.
//
// TODO (future): for followup = 'text' leads we intentionally do NOT send an
// automated SMS. Commercial SMS in the US requires A2P 10DLC registration.
// At the current volume the team replies manually from the internal alert.
// Twilio would be the natural evolution once 10DLC is registered.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') ?? 'onboarding@resend.dev'
const INTERNAL_TO = 'vitor@veehtor.com'
const CALENDAR_LINK = 'https://cal.com/veehtorai'

type Row = Record<string, unknown>

const val = (v: unknown) => {
  if (v === null || v === undefined || v === '') return null
  return String(v)
}

async function sendEmail(to: string, subject: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: NOTIFY_FROM, to: [to], subject, text }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error(`Resend send failed [${res.status}] to=${to}: ${body}`)
    return false
  }
  console.log(`Email sent to ${to}: ${subject}`)
  return true
}

function buildInternal(table: string, row: Row) {
  const isRaiox = table === 'raiox_leads'
  const source = isRaiox ? 'Raio-X' : 'Analisar processo'
  const market = (val(row.market) ?? '').toLowerCase() === 'us' ? 'US' : 'BR'
  const who = val(row.name) ?? val(row.area) ?? val(row.company) ?? 'sem nome'
  const subject = `Novo lead do site · ${source} · ${market} · ${who}`

  const lines: Array<[string, string | null]> = isRaiox
    ? [
        ['Mercado', val(row.market)],
        ['Porte / tamanho', val(row.size)],
        ['Área', val(row.area)],
        ['Situação', val(row.situation)],
        ['Impacto estimado', val(row.impact)],
        ['Prioridade', val(row.priority)],
        ['Follow-up escolhido', val(row.followup)],
        ['Nome', val(row.name)],
        ['Contato', val(row.contact)],
      ]
    : [
        ['Mercado', val(row.market)],
        ['Processo', val(row.process)],
        ['Impacto', val(row.impact)],
        ['Nome', val(row.name)],
        ['Empresa', val(row.company)],
        ['Contato', val(row.contact)],
      ]

  const body = [
    `Origem: ${source}`,
    ...lines.map(([k, v]) => `${k}: ${v ?? '-'}`),
    `Data/hora: ${val(row.created_at) ?? new Date().toISOString()}`,
    `ID: ${val(row.id) ?? '-'}`,
  ].join('\n')

  return { subject, body }
}

function buildAutoReply(row: Row) {
  const summary: Array<[string, string | null]> = [
    ['Team size', val(row.size)],
    ['Area', val(row.area)],
    ['Situation', val(row.situation)],
    ['Estimated impact', val(row.impact)],
    ['Priority', val(row.priority)],
  ].filter(([, v]) => v !== null) as Array<[string, string | null]>

  const text = [
    val(row.name) ? `Hi ${val(row.name)},` : 'Hi,',
    '',
    'We received your Operations X-Ray. Here is what you submitted:',
    '',
    ...summary.map(([k, v]) => `${k}: ${v}`),
    '',
    'Our team will review it and get back to you within one business day.',
    '',
    `Prefer to talk sooner? Grab 30 minutes: ${CALENDAR_LINK}`,
    '',
    'Veehtor AI · veehtor.com',
  ].join('\n')

  return { subject: 'Your Operations X-Ray', text }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const payload = await req.json().catch(() => ({}))
    const table: string = payload?.table ?? payload?.type ?? ''
    const row: Row = payload?.record ?? payload?.row ?? {}

    if (!row || Object.keys(row).length === 0) {
      console.log('notify-lead: no record in payload, skipping')
      return json({ ok: true, skipped: 'no_record' })
    }

    if (!RESEND_API_KEY) {
      console.log('notify-lead: RESEND_API_KEY not configured, skipping sends')
      return json({ ok: true, skipped: 'no_api_key' })
    }

    const { subject, body } = buildInternal(table, row)
    await sendEmail(INTERNAL_TO, subject, body)

    if (table === 'raiox_leads' && String(row.followup ?? '') === 'email') {
      const contact = val(row.contact)
      if (contact && contact.includes('@')) {
        const reply = buildAutoReply(row)
        // Fails silently (logged) when the domain is not yet verified in Resend.
        await sendEmail(contact, reply.subject, reply.text)
      } else {
        console.log('notify-lead: followup=email but contact is not an email address')
      }
    }

    return json({ ok: true })
  } catch (e) {
    console.error('notify-lead error:', e instanceof Error ? e.message : String(e))
    // Never fail the caller: lead inserts must not depend on notifications.
    return json({ ok: true, error: 'handled' })
  }
})
