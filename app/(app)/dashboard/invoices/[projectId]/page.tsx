import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { InvoiceDraftPreview } from "./invoice-draft-preview";

type Props = { params: Promise<{ projectId: string }> };

export default async function InvoiceDraftPage({ params }: Props) {
  const user = await requireAuth();
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { scopeItems: { orderBy: { createdAt: "asc" } } },
  });

  if (!project) notFound();

  const approvedItems = project.scopeItems.filter((item) => item.status === "APPROVED");
  const isReady = project.scopeItems.length > 0 && approvedItems.length === project.scopeItems.length;
  const total = approvedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const issuedAt = new Date();
  const invoiceNumber = `WL-${project.id.slice(0, 8).toUpperCase()}`;
  const freelancerEmail = user.email ?? "Your Worklit account";

  if (!isReady) {
    return (
      <div className="flex flex-col gap-7">
        <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
              Billing
            </div>
            <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
              Invoice not ready
            </h1>
            <p className="mt-2.5 max-w-[52ch] text-[15px] text-text-mid">
              This project still has scope items that are pending, deferred, or rejected.
            </p>
          </div>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-border bg-bg-card px-[28px] py-[44px] text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-bg-alt">
            <DocumentTextIcon className="h-5 w-5 text-text-soft" />
          </div>
          <div className="font-heading text-[26px] tracking-[-0.015em] text-text">
            Approve every item first.
          </div>
          <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-[1.6] text-text-mid">
            Invoice drafts only use fully approved scopes, so the bill matches the record your client signed off.
          </p>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="mt-6 inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[var(--radius)] bg-green px-4 py-2 text-[13px] font-medium text-white no-underline shadow-[var(--shadow-sm)] transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green-hover active:scale-[0.97]"
          >
            Review scope
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="invoice-print-root flex flex-col gap-5">
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1 print:hidden">
        <div className="min-w-0">
          <Link
            href="/dashboard/invoices"
            className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-text-mid no-underline transition-colors duration-150 hover:text-green"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Back to invoices
          </Link>
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Billing
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Invoice draft
          </h1>
          <p className="mt-2.5 max-w-[52ch] text-[15px] text-text-mid">
            Review the approved line items, then download the PDF to send to your client.
          </p>
        </div>
      </header>

      <InvoiceDraftPreview
        approvedItems={approvedItems.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: Number(item.price),
        }))}
        clientEmail={project.clientEmail}
        clientName={project.clientName}
        freelancerEmail={freelancerEmail}
        invoiceNumber={invoiceNumber}
        issuedAtIso={issuedAt.toISOString()}
        projectId={project.id}
        projectTitle={project.title}
        total={total}
      />
    </div>
  );
}
