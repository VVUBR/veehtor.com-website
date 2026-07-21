// Envia o lead do formulário "Mapear meu processo" para uma Google Sheet
// via Google Apps Script Web App (endpoint público /exec).
// Content-Type text/plain evita preflight CORS — o Apps Script lê o corpo
// normalmente via e.postData.contents.

export const CALENDAR_URL = ""; // ex.: Cal.com ou Calendly

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyK9drTn1ojx4NyPcyDWKJkbYrHUKrFJnpN2XOJYWhe9RDbDrSBXO_XfzA-xXUFIPxQ5g/exec";

export interface ProcessMappingData {
  processo: string;
  impactos: string[]; // rótulos traduzidos (PT ou EN, conforme idioma)
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

export async function submitProcessMapping(
  data: ProcessMappingData
): Promise<{ ok: boolean }> {
  try {
    const payload = {
      nome: data.nome,
      empresa: data.empresa,
      email: data.email,
      telefone: data.whatsapp,
      processo: data.processo,
      impactos: data.impactos.join(", "),
    };

    const res = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!res.ok) return { ok: false };
    const json = await res.json().catch(() => ({ ok: true }));
    return { ok: json.ok !== false };
  } catch {
    return { ok: false };
  }
}
