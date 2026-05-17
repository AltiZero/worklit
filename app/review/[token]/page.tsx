import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ItemButtons, SubmitSection } from "./review-actions";
import { ReviewOpenTracker } from "./review-open-tracker";

type Props = { params: Promise<{ token: string }> };

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const ct = await prisma.clientToken.findUnique({
    where: { token },
    include: { project: { include: { scopeItems: { orderBy: { createdAt: "asc" } } } } },
  });

  if (!ct || ct.expiresAt < new Date() || ct.revokedAt) {
    notFound();
  }

  const { project } = ct;
  const total = project.scopeItems.reduce((sum, item) => sum + Number(item.price), 0);
  const allReviewed = project.scopeItems.every((item) => item.status !== "PENDING");
  const isSubmitted = Boolean(ct.submittedAt);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-16">
      <ReviewOpenTracker token={token} />
      <div className="w-full max-w-[560px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-light text-green-dark text-[11px] font-semibold tracking-[0.08em] uppercase py-[5px] px-3 rounded-full mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-green" />
            Review request
          </div>
          <h1 className="font-heading text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-text mb-3">
            {project.title}
          </h1>
          <p className="text-[15px] text-text-mid">
            From {project.clientName} · {project.scopeItems.length} item{project.scopeItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Scope items */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden mb-6">
          {project.scopeItems.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-6 py-5 ${
                i < project.scopeItems.length - 1 ? "border-b border-border" : ""
              } ${
                item.status === "APPROVED"
                  ? "bg-green-light/30"
                  : item.status === "REJECTED"
                    ? "opacity-55"
                    : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex items-center justify-center text-[11px] font-semibold text-text-mid flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-text">{item.title}</div>
                {item.description && (
                  <div className="text-[12px] text-text-soft mt-0.5">{item.description}</div>
                )}
              </div>
              <div className="text-[14px] font-semibold text-text flex-shrink-0">
                {fmtMoney(Number(item.price))}
              </div>
              <ItemButtons
                token={token}
                itemId={item.id}
                status={item.status}
                isSubmitted={isSubmitted}
              />
            </div>
          ))}
        </div>

        {/* Total + submit */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] text-text-mid">Total scope</div>
            <div className="font-heading text-[24px] text-text tracking-[-0.01em]">{fmtMoney(total)}</div>
          </div>
          <div className="text-[13px] text-text-mid mb-6">
            {allReviewed
              ? "All items have been reviewed."
              : `${project.scopeItems.filter((s) => s.status === "PENDING").length} item(s) still pending.`}
          </div>

          <SubmitSection token={token} initialSubmitted={isSubmitted} />
        </div>

        <p className="text-center text-[12px] text-text-soft mt-6">
          Powered by Worklit — Scope approval for freelancers.
        </p>
      </div>
    </div>
  );
}
