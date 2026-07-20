export type Sector =
  | "Agribusiness"
  | "Food & Beverage"
  | "Nonprofit"
  | "Construction (USA)";

export type Area =
  | "Sales"
  | "Finance"
  | "Legal"
  | "Marketing"
  | "Operations"
  | "Product"
  | "Human Resources"
  | "Customer Relations"
  | "Technology";

export interface Metric {
  value: string;
  label: string;
  estimated?: boolean;
}

export interface AboutClient {
  sector: string;
  size?: string;
  scale?: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  sector: Sector;
  areas: Area[];
  title: string;
  summary: string;
  metrics: [Metric, Metric, Metric];
  challenge: string;
  solution: string;
  result: string;
  aboutClient: AboutClient;
  seoDescription: string;
  /** Hidden until a real, approved client quote is added. */
  quote?: { text: string; author: string };
}

/** Full enum kept even for areas not yet represented in any case. */
export const ALL_AREAS: Area[] = [
  "Sales",
  "Finance",
  "Legal",
  "Marketing",
  "Operations",
  "Product",
  "Human Resources",
  "Customer Relations",
  "Technology",
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "dcarvalho-credit-scoring",
    client: "D.Carvalho (John Deere dealership network)",
    sector: "Agribusiness",
    areas: ["Finance"],
    title: "D.Carvalho: credit decisions that took 5 to 7 days now take minutes",
    summary:
      "How a John Deere dealership network replaced gut-feel credit decisions with its own AI credit-scoring system.",
    metrics: [
      { value: "5-7 days to minutes", label: "Credit decision time" },
      { value: "8 of 10", label: "Dealerships running the system" },
      { value: "~4,000", label: "Customers scored" },
    ],
    challenge:
      "The group makes daily credit decisions on deals that reach millions of dollars. A clean record at the credit bureau did not mean a good payer: many customers with spotless external reputations paid late and renegotiated internally. Every decision was close to a bet, and wrong bets hit the company's cash.",
    solution:
      "We built the company its own credit-analysis system. It learns from each customer's real purchase and payment behavior, then crosses that with external signals: commodity prices, regional weather, interest rates, government farm-credit policy. Every customer gets a score from 0 to 1,000, and an AI credit-analyst agent trained on the company's own policies delivers a ready recommendation of limit, rate, and down payment.",
    result:
      "Decisions made in the dark on partial data are now informed decisions with real visibility of each customer's risk. Analysis that could take weeks takes minutes, cash planning got sharper, and a one-off project became an ongoing partnership with new AI projects being built together.",
    aboutClient: {
      sector: "Farm equipment dealerships (John Deere)",
      size: "10 dealerships, ~500 employees",
      scale: "~4,000 active customers",
    },
    seoDescription:
      "A John Deere dealership network replaced gut-feel credit calls with an AI credit-scoring system: decisions in minutes, ~4,000 customers scored, deployed at 8 of 10 dealerships.",
  },
  {
    slug: "complo-time-tracking",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Human Resources"],
    title: "Complô: a full day of payroll closing now takes minutes",
    summary:
      "How a brewery hiring up to 40 freelancers a week replaced manual time tracking with geolocated clock-in and automatic payment.",
    metrics: [
      { value: "~R$30,000/year", label: "Management time recovered", estimated: true },
      { value: "30-40", label: "Freelancers paid per week" },
      { value: "1 day to minutes", label: "Weekly payroll closing" },
    ],
    challenge:
      "Across eight locations, freelancer hours were tracked by hand. The manager lost every Monday closing what each person was owed, with no proof of who worked when, and hour disputes could turn into labor claims.",
    solution:
      "We built an app where each freelancer clocks in and out on their own phone, with geolocation confirming they are at the venue. Forgotten clock-outs close automatically and alert the manager. Every Monday the payment calculation arrives ready on WhatsApp: hours worked, amount owed, and each person's payment key.",
    result:
      "Monday closing went from a full day to minutes, paid hours now match worked hours, and the company's exposure to hour disputes dropped. This was module one of a platform that kept growing.",
    aboutClient: {
      sector: "Brewery with its own production plus bars and restaurants",
      size: "8 active locations",
      scale: "30-40 freelancers per week",
    },
    seoDescription:
      "A brewery with 8 locations replaced manual timecards with geolocated clock-in and automatic payroll. Monday closing went from a full day to minutes.",
  },
  {
    slug: "complo-ai-checklists",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Operations"],
    title: "Complô: AI now verifies opening and closing at all eight locations",
    summary:
      "Photo-verified digital checklists, scored by AI, catch problems at opening instead of on a packed Saturday night.",
    metrics: [
      { value: "8", label: "Locations standardized" },
      { value: "1 to 5", label: "AI score on every photo check" },
      { value: "Same morning", label: "When issues get caught and fixed" },
    ],
    challenge:
      "Every location depends on an opening and closing routine that cannot fail: restock the taps, check the nitrogen pressure, clean the bathrooms. Nothing guaranteed it was actually done. Failures surfaced at the worst moment, with a full house, and ended up as negative Google reviews.",
    solution:
      "Staff follow a digital checklist in the app. For critical items they submit a photo, and an AI scores it from 1 to 5. A low score alerts the manager immediately, photo attached, before customers notice. Top-scored photos become the reference standard, and every check is logged.",
    result:
      "The routine stopped depending on memory. Problems are caught at opening and fixed the same morning, and the company has a full audit history of every opening and closing at every location.",
    aboutClient: {
      sector: "Brewery with its own production plus bars and restaurants",
      size: "8 active locations",
      scale: "30-40 freelancers per week",
    },
    seoDescription:
      "Photo-verified digital checklists scored by AI catch opening and closing failures the same morning across all eight Complô locations.",
  },
  {
    slug: "complo-ai-dashboard",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Finance", "Operations"],
    title: "Complô: an AI analyst watching every location, 24/7",
    summary:
      "One real-time dashboard unified systems that did not talk to each other, with an AI that explains what is happening and what to do.",
    metrics: [
      { value: "All locations", label: "One real-time panel" },
      { value: "74%", label: "Of revenue found concentrated on weekends" },
      { value: "24/7", label: "AI analysis on live data" },
    ],
    challenge:
      "Sales, orders, and cost data lived in systems that did not talk to each other: digital menu, POS, spreadsheets. Understanding why sales dropped in a week meant consolidating everything by hand, so it almost never happened, and decisions ran on gut feel.",
    solution:
      "We built one dashboard that unifies all systems in real time. On top of the numbers, an AI explains what is happening and suggests what to do, like an analyst working around the clock: it flagged that 74% of revenue concentrates on weekends, so weekday staffing can run leaner, and it warns when freelancer cost runs above what that week's sales justify.",
    result:
      "Each manager opens the panel and sees their location; the owners see the whole picture. Correction stopped waiting for month-end close: managers act while the result can still change.",
    aboutClient: {
      sector: "Brewery with its own production plus bars and restaurants",
      size: "8 active locations",
      scale: "30-40 freelancers per week",
    },
    seoDescription:
      "One real-time dashboard unified Complô's disconnected systems, with an AI analyst explaining what's happening and what to do 24/7.",
  },
  {
    slug: "complo-customer-voice",
    client: "Cervejaria Complô",
    sector: "Food & Beverage",
    areas: ["Customer Relations"],
    title: "Complô: Google reviews turned into a weekly action list",
    summary:
      "Every Monday, the week's reviews arrive collected, prioritized, and answerable from the same dashboard managers already use.",
    metrics: [
      { value: "100%", label: "Of weekly reviews collected automatically" },
      { value: "Monday", label: "Weekly cadence, right after the busy weekend" },
      { value: "Week over week", label: "Complaint trends tracked" },
    ],
    challenge:
      "Reviews were read one by one, so it was hard to see which complaints repeated week after week, and the company reacted late to what customers were saying.",
    solution:
      "Every Monday the system collects the week's Google reviews into the dashboard, organizes them by rating, automatically surfaces what needs attention first (complaints, unanswered comments), and lets the manager reply from there.",
    result:
      "It went from \"I hear it's bad\" to \"I can see on the panel what is bad, and where.\" Managers prioritize the real issue, and the company tracks whether a fix actually made the complaint drop.",
    aboutClient: {
      sector: "Brewery with its own production plus bars and restaurants",
      size: "8 active locations",
      scale: "30-40 freelancers per week",
    },
    seoDescription:
      "Google reviews collected every Monday and turned into a prioritized action list Complô managers act on from their existing dashboard.",
  },
  {
    slug: "phomenta-linkedin-leads",
    client: "Instituto Phomenta",
    sector: "Nonprofit",
    areas: ["Sales"],
    title: "Phomenta: qualified LinkedIn leads with messages ready to send",
    summary:
      "An AI workflow finds the right people at target companies, validates fit, and writes personalized outreach, leaving only the sending to humans.",
    metrics: [
      { value: "15-20 min to seconds", label: "Research and validation per lead" },
      { value: "~80%", label: "Of prospecting time eliminated", estimated: true },
      { value: "100%", label: "Of leads validated for role and fit" },
    ],
    challenge:
      "Finding the right contact at each target company, checking their role and fit, and writing a personalized message took 15 to 20 minutes of research per lead, plus another 10 minutes of writing. Outreach capacity was capped by the team's hours.",
    solution:
      "From the target-company base, an automated workflow finds profiles, validates the company, seniority, and fit with social-impact themes, and creates the lead in the CRM. An AI agent then writes a synergy summary plus a personalized connection invite and a follow-up message for each lead. The team reviews and sends manually, keeping compliance and the human touch: the machine does the grunt work, the person does the relationship.",
    result:
      "Research and validation per lead dropped from 15-20 minutes to seconds, personalized copy from ~10 minutes to seconds, cutting overall prospecting time by roughly 80%. No more generic copy-paste: every lead gets an approach based on their own corporate context, and the team's hours moved from hunting names and titles to conversations and closing.",
    aboutClient: {
      sector: "Nonprofit support institute (trains and connects NGOs and companies)",
      scale: "National outreach operation",
    },
    seoDescription:
      "An AI workflow finds and validates LinkedIn leads for Phomenta and writes personalized outreach in seconds, cutting prospecting time by roughly 80%.",
  },
  {
    slug: "phomenta-grant-prospecting",
    client: "Instituto Phomenta",
    sector: "Nonprofit",
    areas: ["Sales"],
    title:
      "Phomenta: a national nonprofit database filtered for one grant in hours",
    summary:
      "A rules-based engine reads a grant's criteria and filters a national public database down to the organizations that can actually win it.",
    metrics: [
      {
        value: "Thousands in minutes",
        label: "Organizations screened (manual pace was hundreds per week)",
      },
      { value: "Hours, not weeks", label: "To respond to a new grant" },
      { value: "~US$20", label: "Total processing cost for a real grant" },
    ],
    challenge:
      "For each new grant, finding which nonprofits fit the eligibility criteria meant manually screening a national database of hundreds of thousands of organizations: legal status, category, region, social focus. Weeks of work for every grant cycle, and running AI over the whole database would cost thousands of dollars.",
    solution:
      "We built a hybrid pipeline: code where speed and cost matter, AI where context matters. A rules engine reads the grant's criteria and filters the database deterministically: legal-nature codes, exclusion rules, a 0-4 territorial-vulnerability score built from address markers, a 0-4 social-area score, and a strict municipality filter. Only the approved organizations reach the AI, which writes personalized outreach for each one.",
    result:
      "Screening went from hundreds of organizations per week to thousands in minutes. Delivered on a real federal-bank grant at about US$20 of processing cost, and every approved organization carries an auditable justification (its scores and criteria), which funders can trace. Responding to a new grant now means swapping the PDF and the rules: hours, not weeks.",
    aboutClient: {
      sector: "Nonprofit support institute (trains and connects NGOs and companies)",
      scale: "National outreach operation",
    },
    seoDescription:
      "A hybrid rules-plus-AI pipeline filters a national nonprofit database for Phomenta grant cycles in hours, at about US$20 of processing cost per grant.",
  },
  {
    slug: "robbin-payroll",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Human Resources"],
    title:
      "Robbin Services: payroll from timecards to payment, calculated automatically",
    summary:
      "A North Carolina electrical subcontractor stopped closing crew payroll by hand: each worker's rules applied automatically, every week.",
    metrics: [
      {
        value: "~US$15,000/year",
        label: "Owner and admin time recovered (6 h/week at US$50/h)",
        estimated: true,
      },
      {
        value: "3",
        label: "Time categories tracked per worker: the job, travel, supply runs",
      },
      { value: "Hours to minutes", label: "Weekly payroll closing" },
    ],
    challenge:
      "Crew timecards lived in the field-service tool, but payroll was closed by hand: each electrician has their own day rate, overtime rule, lunch window, and travel-time treatment. Weekly closing consumed about 6 hours and invited errors: negative durations, missing lunch entries inflating paid hours.",
    solution:
      "We built a pipeline that reads the timecards and applies each person's documented rules automatically: day rates, overtime after 8 hours, lunch detection. Clock-in and clock-out are split into three categories, the job itself, travel time, and supply runs, so every paid hour lands in the right bucket. The pipeline also audits the data, catching inconsistencies that used to distort pay.",
    result:
      "Weekly closing went from hours of spreadsheet work to minutes of review, with each worker paid exactly by their agreed rules. Clean, categorized time data made it possible to compute each technician's real cost per hour, and exposed where paid hours were leaking, which became the field-productivity case below.",
    aboutClient: {
      sector: "Electrical subcontractor for general contractors (North Carolina, USA)",
      size: "Field crew plus virtual assistant",
      scale: "100+ invoices issued",
    },
    seoDescription:
      "A North Carolina electrical subcontractor automated weekly payroll from raw timecards. Closing went from hours to minutes, with each worker's rules applied per line.",
  },
  {
    slug: "robbin-receivables-cash",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Finance"],
    title:
      "Robbin Services: invoices into QuickBooks, and overdue balances that stopped hiding",
    summary:
      "An AI parser posts invoices and monthly costs into QuickBooks, and a weekly receivables review turned unpaid balances into rules, reminders, and protected cash.",
    metrics: [
      {
        value: "US$5,000-14,500",
        label: "In at-risk receivables surfaced and chased per week",
      },
      { value: "50%", label: "Upfront deposit now required on large projects" },
      { value: "100+", label: "Invoices processed automatically" },
    ],
    challenge:
      "Every invoice and monthly cost was typed into QuickBooks by hand, and unpaid balances piled up unnoticed: invoices marked as paid still carried open balances, overdue customers kept getting new bookings, and some jobs quietly lost money, with material alone eating most of the revenue.",
    solution:
      "An AI parser reads the invoices, extracts the data, and posts monthly costs directly into QuickBooks Online. On top of clean books, a weekly monitoring routine surfaces open and overdue balances and turned into business rules: automatic payment reminders (1 day before, 3 and 7 days after due date), a 50% upfront deposit on large projects, a booking lock for customers more than 7 days late, and margin checks that flag jobs where material cost is out of proportion, now covered by a minimum-price policy and formal change orders.",
    result:
      "Data entry disappeared and the books stay current. Every week, US$5,000 to US$14,500 in at-risk balances get surfaced and acted on instead of aging silently, and cash became predictable: deposits before big jobs, reminders on schedule, and no new work booked for late payers.",
    aboutClient: {
      sector: "Electrical subcontractor for general contractors (North Carolina, USA)",
      size: "Field crew plus virtual assistant",
      scale: "100+ invoices issued",
    },
    seoDescription:
      "AI posts invoices into QuickBooks and a weekly receivables review turned unpaid balances into deposits, reminders, and protected cash for Robbin Services.",
  },
  {
    slug: "robbin-field-productivity",
    client: "Robbin Services",
    sector: "Construction (USA)",
    areas: ["Operations"],
    title:
      "Robbin Services: non-billable hours cut from up to 18% to under 5%",
    summary:
      "Tracking work, travel, and supply runs separately exposed where paid hours leaked, and simple routines turned the leak into billable capacity and bigger jobs.",
    metrics: [
      { value: "18.2% to under 5%", label: "Non-billable share of paid hours" },
      {
        value: "10-15 h/week",
        label: "Of productive capacity freed (US$300-500/week in payroll)",
      },
      { value: "+50%", label: "Average job ticket (US$2,101 to US$3,148)" },
    ],
    challenge:
      "Paid hours were leaking into supply-store runs and unplanned driving: non-billable time consumed 13.5% to 18.2% of the crew's week, and in one extreme week a technician spent 36.9% of his paid time buying supplies. Nothing measured the leak, so nothing managed it.",
    solution:
      "With clock-in and clock-out already split into job, travel, and supply time (see the payroll case), the leak became visible week by week. We turned measurement into routine: purchases consolidated into two supply runs per week, pre-job material checklists so crews arrive complete, routing by zone, and a weekly report tracking the non-billable share. The freed hours were pointed at higher-ticket jobs and recurring key accounts.",
    result:
      "Whole weeks now close with zero supply hours, non-billable time runs between 0% and 4.7%, and 10 to 15 hours per week came back as billable capacity. The average job ticket rose about 50%, and weekly revenue grew 66% in the first weeks of the new schedule.",
    aboutClient: {
      sector: "Electrical subcontractor for general contractors (North Carolina, USA)",
      size: "Field crew plus virtual assistant",
      scale: "100+ invoices issued",
    },
    seoDescription:
      "Splitting paid time into job, travel, and supply runs let Robbin Services cut non-billable hours from up to 18% to under 5% and raise the average ticket by 50%.",
  },
];
