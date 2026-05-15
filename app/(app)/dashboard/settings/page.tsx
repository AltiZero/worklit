"use client";

import { useState } from "react";
import {
  CheckIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

import { logout } from "@/app/actions/auth";

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

const inputClass =
  "w-full bg-bg-card border-[1.5px] border-border-mid rounded-[var(--radius)] py-[11px] px-[14px] text-[14px] text-text placeholder:text-text-soft focus:border-green focus:ring-3 focus:ring-[oklch(48%_0.120_148_/_0.12)] focus:outline-none transition-[border-color,box-shadow] duration-150";

const labelClass = "text-[12.5px] font-medium text-text mb-1.5 block";

const selectClass =
  inputClass +
  " appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22oklch(62%25%200.005%2065)%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Account and preferences
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Settings
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">
            Manage your profile and invoice defaults.
          </p>
        </div>
      </header>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px] flex flex-col">
          <Eyebrow icon={UserIcon}>Profile</Eyebrow>

          <div className="mt-4">
            <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
              Your details
            </div>
            <p className="text-[13px] text-text-mid mt-1">
              How you appear on invoices and approvals.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                defaultValue="Alex Tran"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="businessName" className={labelClass}>
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                defaultValue="Alex Tran Design"
                placeholder="Your freelance business name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="alex@example.com"
                disabled
                className="w-full bg-bg-alt border-[1.5px] border-border-mid rounded-[var(--radius)] py-[11px] px-[14px] text-[14px] text-text-soft cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-border flex items-center justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] transition-[background,box-shadow] duration-200"
            >
              {saved ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5" /> Saved
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </section>

        {/* Invoice defaults */}
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px] flex flex-col">
          <Eyebrow icon={CurrencyDollarIcon}>Invoice defaults</Eyebrow>

          <div className="mt-4">
            <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
              Billing preferences
            </div>
            <p className="text-[13px] text-text-mid mt-1">
              Prefilled when you generate an invoice.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label htmlFor="currency" className={labelClass}>
                Currency
              </label>
              <select id="currency" defaultValue="USD" className={selectClass}>
                <option value="USD">USD, $</option>
                <option value="EUR">EUR, €</option>
                <option value="GBP">GBP, £</option>
                <option value="CAD">CAD, C$</option>
                <option value="AUD">AUD, A$</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="terms" className={labelClass}>
                  Payment terms
                </label>
                <select id="terms" defaultValue="net15" className={selectClass}>
                  <option value="net7">Net 7</option>
                  <option value="net15">Net 15</option>
                  <option value="net30">Net 30</option>
                  <option value="onReceipt">Due on receipt</option>
                </select>
              </div>
              <div>
                <label htmlFor="tax" className={labelClass}>
                  Tax rate
                </label>
                <div className="flex items-center gap-2 bg-bg-card border-[1.5px] border-border-mid rounded-[var(--radius)] px-[14px] py-[11px] focus-within:border-green focus-within:ring-3 focus-within:ring-[oklch(48%_0.120_148_/_0.12)] transition-[border-color,box-shadow] duration-150">
                  <input
                    id="tax"
                    type="number"
                    defaultValue="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="flex-1 border-none outline-none text-[14px] text-text bg-transparent"
                  />
                  <span className="text-[14px] text-text-soft">%</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="prefix" className={labelClass}>
                Invoice prefix
              </label>
              <input
                id="prefix"
                type="text"
                defaultValue="INV-"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-border flex items-center justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] transition-[background,box-shadow] duration-200"
            >
              {saved ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5" /> Saved
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Account / Session */}
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
          <a
            href="/logout"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text no-underline hover:border-text-mid hover:bg-bg-alt/50 transition-[border-color,background] duration-150"
          >
            Sign out
          </a>
        </div>
      </section>
    </div>
  );
}
