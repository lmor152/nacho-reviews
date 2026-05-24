import { listReviews } from "@/lib/data";
import { ReviewsExplorer } from "@/components/reviews-explorer";
import { SectionHeader } from "@/components/section-header";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await listReviews({ status: "approved" });

  return (
    <div className="px-4 sm:px-10 pb-16 sm:pb-24">
      <section className="mx-auto mt-8 sm:mt-10 max-w-[1400px]">
        <SectionHeader
          index="00"
          eyebrow="Archive"
          title="Every plate, on the record."
        />
        <ReviewsExplorer reviews={reviews} />
      </section>
    </div>
  );
}
