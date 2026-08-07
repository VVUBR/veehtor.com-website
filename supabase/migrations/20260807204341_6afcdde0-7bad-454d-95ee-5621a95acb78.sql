CREATE TABLE public.raiox_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  market TEXT,
  size TEXT,
  area TEXT,
  situation TEXT,
  impact TEXT,
  priority TEXT,
  followup TEXT,
  name TEXT,
  contact TEXT
);
GRANT INSERT ON public.raiox_leads TO anon;
GRANT SELECT, INSERT ON public.raiox_leads TO authenticated;
GRANT ALL ON public.raiox_leads TO service_role;
ALTER TABLE public.raiox_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.raiox_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read leads" ON public.raiox_leads FOR SELECT TO authenticated USING (true);