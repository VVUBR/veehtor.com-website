CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_lead_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  BEGIN
    PERFORM net.http_post(
      url := 'https://mswvlvlfzjeorszylbyq.supabase.co/functions/v1/notify-lead',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', TG_TABLE_NAME,
        'record', to_jsonb(NEW)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_lead_webhook failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_raiox_lead ON public.raiox_leads;
CREATE TRIGGER trg_notify_raiox_lead
AFTER INSERT ON public.raiox_leads
FOR EACH ROW EXECUTE FUNCTION public.notify_lead_webhook();

DROP TRIGGER IF EXISTS trg_notify_process_lead ON public.process_leads;
CREATE TRIGGER trg_notify_process_lead
AFTER INSERT ON public.process_leads
FOR EACH ROW EXECUTE FUNCTION public.notify_lead_webhook();