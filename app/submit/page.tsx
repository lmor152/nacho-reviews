import { SectionHeader } from "@/components/section-header";
import { ScoringGuide } from "@/components/scoring-guide";
import { ReviewForm } from "@/components/review-form";

export const dynamic = "force-dynamic";

export default function SubmitPage() {
  return (
    <div className="px-4 sm:px-10 pb-16 sm:pb-24">
      <section className="mx-auto mt-8 sm:mt-10 max-w-[1400px] grid gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeader
            index="00"
            eyebrow="Field entry"
            title="File a new plate."
          />
          <ReviewForm />
        </div>
        <aside className="lg:sticky lg:top-10 lg:h-fit">
          <SectionHeader
            index="01"
            eyebrow="Scoring guide"
            title="How the scoring works."
          />
          <ScoringGuide />
        </aside>
      </section>
    </div>
  );
}
