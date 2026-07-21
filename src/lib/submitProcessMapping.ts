// INTEGRATION POINT: real submission (CRM/email/calendar/db) plugs in here.
// Test build: fake latency and success.

export const CALENDAR_URL = ""; // e.g. Cal.com or Calendly link

export interface ProcessMappingData {
  processo: string;
  impactos: string[];
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

export function submitProcessMapping(_data: ProcessMappingData): Promise<{ ok: boolean }> {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 900));
}
