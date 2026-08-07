CREATE TABLE public.process_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  market text NOT NULL,
  process text,
  impact text,
  name text,
  company text,
  contact text
);
GRANT INSERT ON public.process_leads TO anon;
GRANT SELECT, INSERT ON public.process_leads TO authenticated;
GRANT ALL ON public.process_leads TO service_role;
ALTER TABLE public.process_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a process lead" ON public.process_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read process leads" ON public.process_leads FOR SELECT TO authenticated USING (true);

CREATE TABLE public.process_lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid REFERENCES public.process_leads(id) ON DELETE CASCADE,
  event text NOT NULL
);
GRANT INSERT ON public.process_lead_events TO anon;
GRANT SELECT, INSERT ON public.process_lead_events TO authenticated;
GRANT ALL ON public.process_lead_events TO service_role;
ALTER TABLE public.process_lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a lead event" ON public.process_lead_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read lead events" ON public.process_lead_events FOR SELECT TO authenticated USING (true);