"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4">Workspace</div>
        <h1 className="font-heading text-[28px] tracking-[-0.02em] leading-none">Settings</h1>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-[18px] mb-5">
        {/* Profile */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-6">
          <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1] text-text mb-1">Profile</div>
          <p className="text-[13px] text-text-soft mb-6">Your personal and business details.</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Full name</label>
              <input
                type="text"
                defaultValue="Alex Tran"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Business name</label>
              <input
                type="text"
                defaultValue="Alex Tran Design"
                placeholder="Your freelance business name"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Email</label>
              <input
                type="email"
                defaultValue="alex@example.com"
                disabled
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-alt px-4 py-[11px] text-[14px] leading-[1.4] text-text-soft shadow-none outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Invoice defaults */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-6">
          <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1] text-text mb-1">Invoice defaults</div>
          <p className="text-[13px] text-text-soft mb-6">Prefilled when you generate an invoice.</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Currency</label>
              <select
                defaultValue="USD"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22oklch(64%25%200.007%2065)%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10"
              >
                <option>USD — $</option>
                <option>EUR — €</option>
                <option>GBP — £</option>
                <option>CAD — C$</option>
                <option>AUD — A$</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Payment terms</label>
                <select
                  defaultValue="net15"
                  className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22oklch(64%25%200.007%2065)%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="net7">Net 7</option>
                  <option value="net15">Net 15</option>
                  <option value="net30">Net 30</option>
                  <option value="onReceipt">Due on receipt</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Tax rate</label>
                <div className="flex items-center gap-2 rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] focus-within:border-green focus-within:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]">
                  <input
                    type="number"
                    defaultValue="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="flex-1 border-none outline-none text-[14px] leading-[1.4] text-text bg-transparent"
                  />
                  <span className="text-[14px] text-text-soft">%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Invoice prefix</label>
              <input
                type="text"
                defaultValue="INV-"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="min-h-[44px] rounded-[var(--radius)] border border-transparent bg-green px-6 py-[11px] text-[14px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] active:scale-[0.97]"
        >
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
