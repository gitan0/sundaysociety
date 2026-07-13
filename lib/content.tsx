import { type Company } from "@/components/CompanyRow";

// Shared copy for both page variants — edit here, both update.

export const availability = "open to remote roles — support & community ops · crypto + ai";

export const bio =
  "Eight years building support teams from scratch across hardware and crypto — Tier 3 escalations, security incidents, and the automations that keep CSAT above 95%. Trading onchain since 2017; co-founded a skincare brand that landed in Sephora. Currently on sabbatical, building with AI daily.";

export const companies: Company[] = [
  {
    name: "Magic Eden",
    title: "BD Manager",
    dates: "May 2025 — Nov 2025",
    logo: "/logos/magic-eden.png",
    oneLiner:
      "Ran the Slingshot user migration post-acquisition — final escalation point for onchain disputes, plus partner and exchange relationships.",
  },
  {
    name: "Slingshot",
    title: "Community Manager",
    dates: "Mar 2023 — May 2025",
    logo: "/logos/slingshot.jpeg",
    oneLiner:
      "Tier 3 escalations, security incident response, and KOL/trader acquisition — cold outreach through personal onboarding — for a multi-chain trading app.",
    note: "Acquired by Magic Eden",
  },
  {
    name: "Pavlok",
    title: "Head of Customer Support",
    dates: "Jul 2016 — Apr 2025",
    logo: "/logos/pavlok.png",
    oneLiner:
      "Solo IC to a 24/7 team of 6 at 95%+ CSAT — thousands of tickets a week, response times cut from hours to under 30 minutes.",
  },
  {
    name: "Casa Selva",
    title: "Co-Founder",
    dates: "Jul 2017 — Mar 2022",
    logo: "/logos/casa-selva.png",
    oneLiner:
      "Grew a D2C skincare brand from zero to Sephora Mexico — content strategy, ambassador program, press in Vogue and Harper's Bazaar.",
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
    meta: "Job board · live",
    href: "https://ats.fyi",
    body: (
      <>
        A job board that scrapes Ashby, Lever, and Greenhouse APIs to surface
        startup roles in a clean, filterable feed — role, industry, salary, VC
        backer, and location across 200+ tech companies.
      </>
    ),
  },
  {
    name: "Touchline",
    meta: "Chrome extension · in progress",
    body: (
      <>
        A Chrome extension that overlays Fantasy Premier League analytics on
        the official site — built to replace the four tabs I&apos;d open every
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
