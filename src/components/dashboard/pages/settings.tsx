"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { PageHeading } from "@/components/dashboard/ui";
import { EditProfileModal } from "@/components/dashboard/edit-profile-modal";
import { useUserProfile } from "@/lib/use-user-profile";
import type { UserProfile } from "@/types/workspace";

export function SettingsPage({
  profile: propProfile,
  onUpdateProfile,
}: {
  profile?: UserProfile;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}) {
  const { profile: hookProfile, saveProfile: hookSave } = useUserProfile();
  const [editing, setEditing] = useState(false);

  const activeProfile = propProfile ?? hookProfile;
  const handleSave = onUpdateProfile ?? hookSave;

  return (
    <>
      <PageHeading eyebrow="ACCOUNT" title="Profile & settings" />
      <section className="panel page-panel profile-card">
        <dl>
          <div>
            <dt>Name</dt>
            <dd>{activeProfile.name}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{activeProfile.role}</dd>
          </div>
          <div>
            <dt>Workspace</dt>
            <dd>{activeProfile.firmName}</dd>
          </div>
          {activeProfile.membershipNo && (
            <div>
              <dt>ICAI Membership No.</dt>
              <dd>{activeProfile.membershipNo}</dd>
            </div>
          )}
          {activeProfile.email && (
            <div>
              <dt>Email</dt>
              <dd>{activeProfile.email}</dd>
            </div>
          )}
          {activeProfile.phone && (
            <div>
              <dt>Phone</dt>
              <dd>{activeProfile.phone}</dd>
            </div>
          )}
        </dl>
        <div style={{ marginTop: "18px" }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setEditing(true)}
          >
            <Edit3 size={15} />
            <span>Edit profile</span>
          </button>
        </div>
      </section>

      {editing && (
        <EditProfileModal
          profile={activeProfile}
          onSave={handleSave}
          close={() => setEditing(false)}
        />
      )}
    </>
  );
}
