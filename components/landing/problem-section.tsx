import { cn } from "@/lib/utils";

import { CheckIcon, XIcon } from "./icons";

const beforeItems = [
  "Email threads nobody can find later",
  '"I thought that was included"',
  "Manual invoices assembled from memory",
  "Work completed before scope was agreed",
  "Clients pay less than quoted",
];

const afterItems = [
  "Every item explicitly approved or rejected",
  "Signed record of what was agreed",
  "Invoice writes itself from approved items",
  "Work starts only after sign-off",
  "No surprises, no disputes",
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 px-20 max-w-[1280px] mx-auto max-[960px]:py-16 max-[960px]:px-6">
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4 reveal">The problem</div>
      <h2 className="font-heading text-[clamp(32px,3vw,48px)] leading-[1.12] tracking-[-0.02em] text-text max-w-[600px] reveal">
        Scope creep costs freelancers
        <br />
        thousands every year.
      </h2>
      <p className="text-[17px] text-text-mid leading-[1.6] max-w-[520px] mt-3 reveal">It&apos;s not that clients are bad. It&apos;s that there&apos;s no clear record of what was agreed.</p>

      <div className="grid grid-cols-2 gap-6 mt-14 max-[960px]:grid-cols-1 reveal">
        <div className="rounded-[var(--radius-lg)] p-9 flex flex-col gap-5 bg-bg-alt border border-border-mid">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase py-[5px] px-3 rounded-full w-fit bg-border text-text-mid">Before Worklit</span>
          <div className="font-heading text-[22px] tracking-[-0.01em] text-text">The old way</div>
          <div className="flex flex-col gap-2.5">
            {beforeItems.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm leading-[1.5] text-text-mid">
                <span className="flex-shrink-0 mt-0.5">
                  <XIcon size={14} color="var(--text-soft)" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] p-9 flex flex-col gap-5 bg-green-light border border-green-mid">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase py-[5px] px-3 rounded-full w-fit bg-green-mid text-green-dark">After Worklit</span>
          <div className="font-heading text-[22px] tracking-[-0.01em] text-green-dark">The Worklit way</div>
          <div className="flex flex-col gap-2.5">
            {afterItems.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm leading-[1.5] text-[oklch(34%_0.080_148)]">
                <span className="flex-shrink-0 mt-0.5">
                  <CheckIcon size={14} color="var(--green)" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
