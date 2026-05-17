import { renderToBuffer } from "@react-pdf/renderer";
import { notFound } from "next/navigation";

import { InvoiceDocument } from "@/lib/pdf/invoice-document";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export const runtime = "nodejs";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseDueDate(value: string | null): Date | null {
  if (!value || !ISO_DATE.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

type Params = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, { params }: Params) {
  const user = await requireAuth();
  const { projectId } = await params;
  const url = new URL(request.url);

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { scopeItems: { orderBy: { createdAt: "asc" } } },
  });

  if (!project) notFound();

  const approvedItems = project.scopeItems.filter(
    (item) => item.status === "APPROVED",
  );
  const isReady =
    project.scopeItems.length > 0 &&
    approvedItems.length === project.scopeItems.length;

  if (!isReady) {
    return new Response("Invoice is not ready: approve every scope item first.", {
      status: 409,
    });
  }

  const issuedAt = new Date();
  const requestedDueDate = parseDueDate(url.searchParams.get("dueDate"));
  const dueDate = requestedDueDate ?? new Date(issuedAt.getTime() + 14 * 86_400_000);

  const total = approvedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const invoiceNumber = `WL-${project.id.slice(0, 8).toUpperCase()}`;

  const buffer = await renderToBuffer(
    <InvoiceDocument
      approvedItems={approvedItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: Number(item.price),
      }))}
      clientEmail={project.clientEmail}
      clientName={project.clientName}
      dueDate={dueDate}
      freelancerEmail={user.email ?? "Your Worklit account"}
      freelancerName={user.user_metadata?.full_name ?? user.email ?? "Worklit freelancer"}
      invoiceNumber={invoiceNumber}
      issuedAt={issuedAt}
      projectTitle={project.title}
      total={total}
    />,
  );

  const filename = `${invoiceNumber}.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
