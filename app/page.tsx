import Link from "next/link";
import { computeStats, listReviews } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Leaderboard } from "@/components/leaderboard";
import { ScoreDistributionChart } from "@/components/charts/score-distribution";
import { DimensionRadarChart } from "@/components/charts/dimension-radar";
import { TimelineChart } from "@/components/charts/timeline";
import { ReviewerSplit } from "@/components/charts/reviewer-split";
import { ReviewMapLoader } from "@/components/review-map-loader";
import { ReviewCard } from "@/components/review-card";
import { ChipIcon } from "@/components/chip-icon";
import { Hero } from "@/components/hero";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [reviews, stats] = await Promise.all([
    listReviews({ status: "approved" }),
    computeStats(),
  ]);

  const recent = reviews.slice(0, 3);

  return (
    <div className="px-4 sm:px-10 pb-16 sm:pb-24">
      <Hero stats={stats} />

      <section className="mx-auto mt-8 sm:mt-10 max-w-[1400px]">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            index="01"
            label="Plates filed"
            value={stats.approvedReviews}
            hint="approved entries on record"
            accent="salsa"
            delay={0.05}
          />
          <StatCard
            index="02"
            label="Average overall"
            value={stats.averageOverall}
            decimals={2}
            suffix=" /10"
            hint="across the entire archive"
            accent="cheese"
            delay={0.12}
          />
          <StatCard
            index="03"
            label="Restaurants visited"
            value={stats.uniqueRestaurants}
            hint="unique establishments"
            accent="jalapeno"
            delay={0.19}
          />
          <StatCard
            index="04"
            label="Spent on chips"
            value={stats.totalSpent}
            decimals={2}
            prefix="≈ "
            hint="aggregate plate cost (mixed currencies)"
            accent="tortilla"
            delay={0.26}
          />
        </div>
      </section>

      <section className="mx-auto mt-12 sm:mt-24 max-w-[1400px]">
        <SectionHeader
          index="01"
          eyebrow="Cartography"
          title="The world, plotted in chips."
        />
        <ReviewMapLoader reviews={reviews} />
      </section>

      <section className="mx-auto mt-12 sm:mt-24 max-w-[1400px] grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="panel p-5 sm:p-6 lg:col-span-2">
          <SectionHeader
            index="02"
            eyebrow="Distribution"
            title="The shape of every plate."
          />
          <ScoreDistributionChart data={stats.scoreDistribution} />
        </div>
        <div className="panel p-5 sm:p-6">
          <SectionHeader
            index="03"
            eyebrow="Composition"
            title="Strength by axis."
          />
          <DimensionRadarChart data={stats.dimensions} />
        </div>
      </section>

      <section className="mx-auto mt-8 sm:mt-10 max-w-[1400px] grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="panel-dark p-5 sm:p-6 lg:col-span-2">
          <header className="mb-4 flex items-center gap-3">
            <ChipIcon size={32} rotate={-12} />
            <div className="min-w-0">
              <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-cheese)]">
                §04 · over time
              </p>
              <h2 className="display text-2xl sm:text-3xl text-[var(--color-cream-light)]">
                The taste of the months.
              </h2>
            </div>
          </header>
          <TimelineChart data={stats.byMonth} />
        </div>
        <div className="panel p-5 sm:p-6">
          <SectionHeader
            index="05"
            eyebrow="Authors"
            title="Who's writing it?"
          />
          <ReviewerSplit data={stats.reviewerSplit} />
        </div>
      </section>

      <section className="mx-auto mt-12 sm:mt-24 max-w-[1400px] grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="panel overflow-hidden p-5 sm:p-6">
          <SectionHeader
            index="06"
            eyebrow="Hall of fame"
            title="Top five plates."
          />
          <Leaderboard reviews={reviews} />
        </div>
        <div className="panel overflow-hidden p-5 sm:p-6">
          <SectionHeader
            index="07"
            eyebrow="Recently filed"
            title="Latest from the field."
          />
          <div className="flex flex-col gap-5">
            {recent.map((r, i) => (
              <ReviewCard review={r} index={i} key={r.id} embedded />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Link href="/reviews" className="btn-ghost text-sm">
              See all {stats.approvedReviews} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
