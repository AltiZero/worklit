"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/16/solid";

type Props = {
  projectId: string;
  dueDateIso: string;
};

function toQueryDate(iso: string) {
  return iso.slice(0, 10);
}

export function PrintInvoiceButton({ projectId, dueDateIso }: Props) {
  const href = `/dashboard/invoices/${projectId}/pdf?dueDate=${toQueryDate(dueDateIso)}`;

  return (
    <a
      href={href}
      className="inline-flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] bg-green px-4 py-2 text-[13px] font-medium text-white no-underline shadow-[var(--shadow-sm)] transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green-hover active:scale-[0.97] sm:w-auto print:hidden"
    >
      <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
      Download PDF
    </a>
  );
}
