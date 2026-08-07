DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.raiox_leads;
DROP POLICY IF EXISTS "Authenticated users can read process leads" ON public.process_leads;
DROP POLICY IF EXISTS "Authenticated users can read lead events" ON public.process_lead_events;

REVOKE SELECT ON public.raiox_leads FROM authenticated, anon;
REVOKE SELECT ON public.process_leads FROM authenticated, anon;
REVOKE SELECT ON public.process_lead_events FROM authenticated, anon;