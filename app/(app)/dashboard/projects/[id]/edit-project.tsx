"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { updateProject, deleteProject, type ProjectState } from "@/app/actions/projects";

const updateInitial: ProjectState = {};

export function EditProject({
  projectId,
  title,
  clientName,
  clientEmail,
  summary,
}: {
  projectId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  summary: string;
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
      <header className="pt-1">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-3">
          Editing project
        </div>
        <form action={formAction} className="flex flex-col gap-4 max-w-[640px]">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-title"
              className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-mid"
            >
              Project title
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              required
              defaultValue={title}
              autoFocus
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-clientName"
                className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-mid"
              >
                Client name
              </label>
              <input
                id="edit-clientName"
                name="clientName"
                type="text"
                required
                defaultValue={clientName}
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-clientEmail"
                className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-mid"
              >
                Client email
              </label>
              <input
                id="edit-clientEmail"
                name="clientEmail"
                type="email"
                required
                defaultValue={clientEmail}
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
            </div>
          </div>

          {state.message && (
            <p className="text-[13px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-4 py-3 border border-border-mid">
              {state.message}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium shadow-[var(--shadow-sm)] hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] transition-[background,box-shadow] duration-200 disabled:bg-border-mid disabled:text-text-soft disabled:shadow-none disabled:cursor-default"
            >
              {pending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </header>
    );
  }

  return (
    <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
          Project
        </div>
        <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
          {title}
        </h1>
        <p className="text-[15px] text-text-mid mt-2.5 max-w-[60ch]">{summary}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Three-dot menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-[34px] h-[34px] rounded-[var(--radius)] bg-transparent border-none cursor-pointer inline-flex items-center justify-center text-text-mid hover:bg-bg-alt hover:text-text transition-[background,color] duration-150"
            aria-label="Project actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-[170px] bg-bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-md)] py-1 z-10 animate-[itemEnter_150ms_ease-out]"
              role="menu"
            >
              <button
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                  setConfirmDelete(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-mid bg-transparent border-none cursor-pointer hover:bg-bg-alt hover:text-text transition-[background,color] duration-100 text-left"
                role="menuitem"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit project
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-mid bg-transparent border-none cursor-pointer hover:bg-bg-alt hover:text-text transition-[background,color] duration-100 text-left"
                role="menuitem"
              >
                <TrashIcon className="w-4 h-4" />
                Delete project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="basis-full bg-bg-alt border border-border-mid rounded-[var(--radius-lg)] px-5 py-4 mt-2">
          <p className="text-[14px] text-text mb-3 leading-[1.5]">
            Delete <span className="font-medium">{title}</span> and all its scope items? This cannot be undone.
          </p>
          <div className="flex items-center gap-2">
            <form action={deleteProject.bind(null, projectId)}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text bg-bg-card hover:border-text-mid hover:bg-bg-alt/50 transition-[border-color,background] duration-150 cursor-pointer"
              >
                Delete project
              </button>
            </form>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
