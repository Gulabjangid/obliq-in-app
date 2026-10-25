"use client";

import { useDialog } from "@/lib/use-dialog";
import { useState } from "react";
import type React from "react";
import { Check, X } from "lucide-react";
import type { UserProfile, UserRole } from "@/types/workspace";

export function EditProfileModal({
  profile,
  onSave,
  close,
}: {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  close: () => void;
}) {
  const [error, setError] = useState("");
  const dialogRef = useDialog(close);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const firmName = String(form.get("firmName") || "").trim();
    const role = (form.get("role") || profile.role) as UserRole;
    const email = String(form.get("email") || "").trim();
    const membershipNo = String(form.get("membershipNo") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    setError("");
    onSave({
      name,
      firmName: firmName || "OBLIQ Workspace",
      role,
      email,
      membershipNo,
      phone,
    });
    close();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-modal-title"
      >
        <div className="modal-head">
          <div>
            <span>PROFILE & SETTINGS</span>
            <h2 id="edit-profile-modal-title">Edit profile</h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={close}
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
              defaultValue={profile.name}
              placeholder="e.g. CA Rajesh Sharma"
            />
          </label>

          <label>
            Role / Designation
            <select
              name="role"
              defaultValue={profile.role}
              className="select-input"
            >
              <option value="Owner">Owner / Partner</option>
              <option value="Reviewer / Senior">Reviewer / Senior</option>
              <option value="Article / Preparer">Article / Preparer</option>
            </select>
          </label>

          <label>
            Firm / Workspace name
            <input
              name="firmName"
              defaultValue={profile.firmName}
              placeholder="e.g. Sharma & Associates"
            />
          </label>

          <label>
            ICAI Membership No. (optional)
            <input
              name="membershipNo"
              defaultValue={profile.membershipNo || ""}
              placeholder="e.g. 123456"
            />
          </label>

          <label>
            Email address (optional)
            <input
              name="email"
              type="email"
              defaultValue={profile.email || ""}
              placeholder="name@example.com"
            />
          </label>

          <label>
            Phone number (optional)
            <input
              name="phone"
              type="tel"
              defaultValue={profile.phone || ""}
              placeholder="+91 98765 43210"
            />
          </label>

          {error && (
            <div role="alert" className="modal-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              <Check size={16} />
              <span>Save changes</span>
            </button>
            <button type="button" className="secondary-button" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
