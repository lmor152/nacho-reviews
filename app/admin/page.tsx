import { listReviews } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";
import { AdminPanel } from "@/components/admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [pending, approved] = await Promise.all([
    listReviews({ status: "pending" }),
    listReviews({ status: "approved" }),
  ]);

  return (
    <div className="px-4 sm:px-10 pb-16 sm:pb-24">
      <section className="mx-auto mt-8 sm:mt-10 max-w-[1400px]">
        <SectionHeader
          index="00"
          eyebrow="Restricted"
          title="Chip-tender's office."
        />
        <AdminPanel
          initialPending={pending}
          initialApproved={approved}
        />
      </section>
    </div>
  );
}
