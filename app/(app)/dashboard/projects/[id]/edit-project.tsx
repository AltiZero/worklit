"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { updateProject, deleteProject, type ProjectState } from "@/app/actions/projects";

const updateInitial: ProjectState = {};

export function EditProject({
  projectId,
  title,
  clientName,
  clientEmail,
}: {
  projectId: string;
  title: string;
  clientName: string;
  clientEmail: string;
}) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [state, formAction, pending] = useActionState(
    updateProject.bind(null, projectId),
    updateInitial,
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (editing) {
    return (
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-title" className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Project title</label>
          <input
            id="edit-title"
            name="title"
            type="text"
            required
            defaultValue={title}
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-clientName" className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Client name</label>
            <input
              id="edit-clientName"
              name="clientName"
              type="text"
              required
              defaultValue={clientName}
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-clientEmail" className="text-[12px] font-semibold text-text-mid uppercase tracking-[0.06em]">Client email</label>
            <input
              id="edit-clientEmail"
              name="clientEmail"
              type="email"
              required
              defaultValue={clientEmail}
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
          </div>
        </div>

        {state.message && (
          <p className="text-[13px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-4 py-3 border border-border-mid">
            {state.message}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-green px-5 py-[10px] text-[13px] font-medium leading-none text-white cursor-pointer shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default disabled:hover:translate-y-0"
          >
            {pending ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-[0.15s]"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-3">Project</div>
          <h1 className="font-heading text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-text mb-2">
            {title}
          </h1>
          <p className="text-[15px] text-text-mid">{clientName} · {clientEmail}</p>
        </div>

        {/* Three-dot menu */}
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-lg bg-bg-card border border-border cursor-pointer flex items-center justify-center text-text-mid hover:bg-bg-alt hover:text-text hover:border-text-soft transition-[background,color,border-color] duration-[0.12s]"
            aria-label="Project actions"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-[160px] bg-bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-md)] py-1 z-10 animate-[itemEnter_150ms_ease-out]">
              <button
                onClick={() => { setEditing(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-mid bg-transparent border-none cursor-pointer hover:bg-bg-alt hover:text-text transition-[background,color] duration-[0.1s] text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit project
              </button>
              <button
                onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-mid bg-transparent border-none cursor-pointer hover:bg-bg-alt hover:text-text transition-[background,color] duration-[0.1s] text-left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                Delete project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-10 pt-8 border-t border-border">
          <div className="bg-bg-alt border border-border-mid rounded-[var(--radius)] px-5 py-4">
            <p className="text-[14px] text-text mb-4">
              Delete <span className="font-medium">{title}</span> and all its scope items? This cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <form action={deleteProject.bind(null, projectId)}>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-text text-bg-card px-5 py-[10px] text-[13px] font-medium leading-none cursor-pointer transition-[background,transform] duration-[0.15s,0.1s] hover:bg-[oklch(50%_0.15_30)] hover:text-white active:scale-[0.97]"
                >
                  Delete project
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-[0.15s]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
