import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Desktop } from "@/components/desktop/Desktop";
import { type WinId } from "@/components/desktop/WindowManager";
import { caseStudies } from "@/lib/content";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  const title = `${cs.company} — ${cs.hook} · Luke Woodhatch`;
  const description = cs.situation;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://sundaysociety.xyz/${cs.slug}`,
      siteName: "sundaysociety",
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();
  return <Desktop initialOpen={slug as WinId} />;
}
