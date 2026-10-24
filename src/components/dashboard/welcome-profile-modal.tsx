"use client";

import { useDialog } from "@/lib/use-dialog";
import { useState } from "react";
import type React from "react";
import { Check, X } from "lucide-react";
import type { UserRole } from "@/types/workspace";

export function WelcomeProfileModal({
  onSave,
  onSkip,
}: {
  onSave: (values: { name: string; firmName: string; role: UserRole }) => void;
  onSkip: () => void;
}) {
  const [error, setError] = useState("");
  const dialogRef = useDialog(onSkip);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const firmName = String(form.get("firmName") || "").trim();
    const role = (form.get("role") || "Owner") as UserRole;

    if (!name) {
      setError("Please enter your name to personalize your workspace.");
      return;
    }

    setError("");
    onSave({
      name,
      firmName: firmName || "OBLIQ Workspace",
      role,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onSkip();
      }}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
      >
        <div className="modal-head">
          <div>
            <span>WELCOME TO OBLIQ</span>
            <h2 id="welcome-modal-title">Set up your profile</h2>
          </div>
          <button
            className="icon-button"
            aria-label="Skip dialog"
            onClick={onSkip}
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="name"
              required
              autoFocus
              placeholder="e.g. CA Rajesh Sharma"
            />
          </label>

          <label>
            Firm / Practice name
            <input name="firmName" placeholder="e.g. Sharma & Associates" />
          </label>

          <label>
            Your role
            <select name="role" defaultValue="Owner" className="select-input">
              <option value="Owner">Owner / Partner</option>
              <option value="Reviewer / Senior">Reviewer / Senior</option>
              <option value="Article / Preparer">Article / Preparer</option>
            </select>
          </label>

          <p className="modal-note">
            You can add your ICAI membership number and contact details anytime
            in Profile & settings.
          </p>

          {error && (
            <div role="alert" className="modal-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              <Check size={16} />
              <span>Get started</span>
            </button>
            <button type="button" className="secondary-button" onClick={onSkip}>
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
