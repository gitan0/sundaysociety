import { type Company } from "@/components/CompanyRow";

// Shared copy for the site — edit here.

export const headline = "I build and run support orgs for AI and crypto companies.";

export const availability = "open to remote support / cx lead roles · ai + crypto";

export const bio =
  "Eight years building support teams from scratch across hardware and crypto. Tier 3 escalations, security incident response, and the automations that keep CSAT above 95%. Trading onchain since 2017. Since late 2025, building my own tools with AI daily.";

export type CaseStudy = {
  slug: string;
  company: string;
  role: string;
  dates: string;
  logo: string;
  hook: string;
  situation: string;
  did: string[];
  numbers: { value: string; label: string }[];
  close: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pavlok",
    company: "Pavlok",
    role: "Head of Customer Support",
    dates: "Jul 2016 — Apr 2025",
    logo: "/logos/pavlok.png",
    hook: "Building a support org from zero",
    situation:
      "Pavlok makes a shock wearable. Hardware means firmware bugs, charging issues, and angry customers with a device on their wrist. When I joined there was no support function. Just a queue, filling up.",
    did: [
      "Answered everything solo, then hired and trained a team of 6 with 24/7 coverage across time zones.",
      "Designed the Intercom automation layer: triggers, macros, and escalation rules that routed tickets before a human touched them.",
      "Wrote the playbooks and training that let the team handle Tier 3 technical issues without me.",
      "Worked directly with engineering on firmware debugging, translating user reports into reproducible bug tickets.",
    ],
    numbers: [
      { value: "95%+", label: "CSAT, held for years" },
      { value: "<30 min", label: "response time, down from hours" },
      { value: "6", label: "person team, 24/7 coverage" },
      { value: "1000s", label: "tickets per week" },
    ],
    close:
      "Nine years, one function, built once and rebuilt as the product changed. The playbook still runs without me.",
  },
  {
    slug: "slingshot",
    company: "Slingshot",
    role: "Community Manager",
    dates: "Mar 2023 — May 2025",
    logo: "/logos/slingshot.jpeg",
    hook: "Tier 3 and incident response for a trading app",
    situation:
      "Slingshot is a multi-chain trading app. Support there means real money, irreversible transactions, and users who need answers fast. I owned the sharp end of the queue through the pivot to trading and the acquisition by Magic Eden.",
    did: [
      "Owned Tier 3 escalations end to end, diagnosing root causes with block explorers, transaction logs, and browser devtools.",
      "Led response during security incidents, including executive account compromises and phishing campaigns, coordinating comms across Discord, Telegram, and X.",
      "Built moderation workflows with keyword filters and auto-actions that handled routine spam without manual review.",
      "Ran KOL and high-volume trader outreach, wrote the campaign copy, then onboarded converted traders personally.",
    ],
    numbers: [
      { value: "acq.", label: "by Magic Eden, May 2025" },
      { value: "T3", label: "final escalation point, onchain" },
      { value: "0", label: "incidents lost to silence" },
    ],
    close:
      "Crypto support is incident response with a queue attached. I learned to run both without dropping either.",
  },
  {
    slug: "magic-eden",
    company: "Magic Eden",
    role: "BD Manager",
    dates: "May 2025 — Nov 2025",
    logo: "/logos/magic-eden.png",
    hook: "Running a post-acquisition user migration",
    situation:
      "Magic Eden acquired Slingshot and needed its user base moved over without losing them. Migrations are where users churn. Someone has to own the seam between two products, two teams, and one confused community.",
    did: [
      "Managed the migration of Slingshot's users into Magic Eden, keeping ticket resolution running through the transition.",
      "Served as final escalation point for complex onchain disputes, diagnosing with explorers and logs before coordinating fixes with engineering.",
      "Kept ecosystem partners, exchanges, and influencers engaged post-acquisition.",
    ],
    numbers: [
      { value: "1", label: "user base migrated, intact" },
      { value: "2", label: "products bridged" },
    ],
    close:
      "The quiet work: nothing broke, nobody noticed. That was the job.",
  },
];

export const companies: Company[] = [
  {
    name: "Magic Eden",
    title: "BD Manager",
    dates: "May 2025 — Nov 2025",
    logo: "/logos/magic-eden.png",
    slug: "magic-eden",
    oneLiner:
      "Ran the Slingshot user migration post-acquisition. Final escalation point for onchain disputes, plus partner and exchange relationships.",
  },
  {
    name: "Slingshot",
    title: "Community Manager",
    dates: "Mar 2023 — May 2025",
    logo: "/logos/slingshot.jpeg",
    slug: "slingshot",
    oneLiner:
      "Tier 3 escalations, security incident response, and KOL acquisition for a multi-chain trading app.",
    note: "Acquired by Magic Eden",
  },
  {
    name: "Pavlok",
    title: "Head of Customer Support",
    dates: "Jul 2016 — Apr 2025",
    logo: "/logos/pavlok.png",
    slug: "pavlok",
    oneLiner:
      "Solo IC to a 24/7 team of 6 at 95%+ CSAT. Thousands of tickets a week, response times cut from hours to under 30 minutes.",
  },
  {
    name: "Casa Selva",
    title: "Co-Founder",
    dates: "Jul 2017 — Mar 2022",
    logo: "/logos/casa-selva.png",
    oneLiner:
      "Grew a D2C skincare brand from zero to Sephora Mexico. Content strategy, ambassador program, press in Vogue and Harper's Bazaar.",
  },
];

export type Project = {
  name: string;
  meta: string;
  href?: string;
  body: React.ReactNode;
};

export const projects: Project[] = [
  {
    name: "ats.fyi",
    meta: "Job board · live · built solo with Claude",
    href: "https://ats.fyi",
    body: (
      <>
        A job board that scrapes Ashby, Lever, and Greenhouse APIs across 200+
        tech companies into a clean, filterable feed. Role, industry, salary,
        VC backer, location. Designed, built, and shipped solo.
      </>
    ),
  },
  {
    name: "Touchline",
    meta: "Chrome extension · in progress",
    body: (
      <>
        A Chrome extension that overlays Fantasy Premier League analytics on
        the official site. Built to replace the four tabs I&apos;d open every
        gameweek.
      </>
    ),
  },
];

export const links = [
  { label: "resume", href: "/resume.pdf" },
  { label: "linkedin", href: "https://linkedin.com/in/lukewoodhatch" },
  { label: "email", href: "mailto:luke@sundaysociety.xyz" },
];
