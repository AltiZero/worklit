import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

import { logout } from "@/app/actions/auth";
import { requireAuth } from "@/lib/supabase/session";

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

const labelClass = "text-[12.5px] font-medium text-text mb-1.5 block";

const readOnlyClass =
  "w-full bg-bg-alt border-[1.5px] border-border-mid rounded-[var(--radius)] py-[11px] px-[14px] text-[14px] text-text-soft cursor-not-allowed";

function displayMetadataValue(metadata: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export default async function SettingsPage() {
  const user = await requireAuth();
  const metadata = user.user_metadata as Record<string, unknown>;
  const email = user.email ?? "No email on account";
  const fullName = displayMetadataValue(metadata, ["full_name", "name"]) || email.split("@")[0] || "Signed-in user";
  const businessName = displayMetadataValue(metadata, ["business_name", "company"]);

  return (
    <div className="flex flex-col gap-7">
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Account and preferences
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Settings
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">
            Review your account details and billing defaults.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px] flex flex-col">
          <Eyebrow icon={UserIcon}>Profile</Eyebrow>

          <div className="mt-4">
            <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
              Your details
            </div>
            <p className="text-[13px] text-text-mid mt-1">
              How you appear on approvals.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input id="fullName" type="text" value={fullName} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label htmlFor="businessName" className={labelClass}>
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName || "Not configured"}
                readOnly
                className={readOnlyClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input id="email" type="email" value={email} readOnly className={readOnlyClass} />
            </div>
          </div>
        </section>

        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px] flex flex-col">
          <Eyebrow icon={CurrencyDollarIcon}>Invoice defaults</Eyebrow>

          <div className="mt-4">
            <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
              Billing preferences
            </div>
            <p className="text-[13px] text-text-mid mt-1">
              Defaults will appear here once invoice generation is added.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label htmlFor="currency" className={labelClass}>
                Currency
              </label>
              <input id="currency" type="text" value="Not configured" readOnly className={readOnlyClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="terms" className={labelClass}>
                  Payment terms
                </label>
                <input id="terms" type="text" value="Not configured" readOnly className={readOnlyClass} />
              </div>
              <div>
                <label htmlFor="tax" className={labelClass}>
                  Tax rate
                </label>
                <input id="tax" type="text" value="Not configured" readOnly className={readOnlyClass} />
              </div>
            </div>

            <div>
              <label htmlFor="prefix" className={labelClass}>
                Invoice prefix
              </label>
              <input id="prefix" type="text" value="Not configured" readOnly className={readOnlyClass} />
            </div>
          </div>
        </section>
      </div>

      <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px]">
        <Eyebrow icon={ShieldCheckIcon}>Account</Eyebrow>

        <div className="mt-4 flex items-end justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
              Session
            </div>
            <p className="text-[13px] text-text-mid mt-1">
              Sign out of this workspace on this device.
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text no-underline hover:border-text-mid hover:bg-bg-alt/50 transition-[border-color,background] duration-150 cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
