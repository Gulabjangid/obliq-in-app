import assert from "node:assert/strict";
import { test } from "node:test";
import { validUserProfile } from "../../src/lib/storage-validation.ts";
import {
  extractFirstName,
  extractInitials,
} from "../../src/lib/use-user-profile.ts";

test("validUserProfile accepts a valid and complete user profile", () => {
  const profile = {
    id: "user-1",
    name: "CA Rajesh Sharma",
    firstName: "Rajesh",
    role: "Owner",
    firmName: "Sharma & Associates",
    email: "rajesh@sharma.in",
    membershipNo: "ICAI-123456",
    phone: "+91 98765 43210",
    isCustomized: true,
  };
  assert.equal(validUserProfile(profile), true);
});

test("validUserProfile accepts valid profile with optional fields omitted", () => {
  const profile = {
    id: "user-2",
    name: "Priya Verma",
    firstName: "Priya",
    role: "Reviewer / Senior",
    firmName: "Verma & Co",
    isCustomized: false,
  };
  assert.equal(validUserProfile(profile), true);
});

test("validUserProfile rejects invalid roles or malformed fields", () => {
  assert.equal(validUserProfile(null), false);
  assert.equal(validUserProfile(undefined), false);
  assert.equal(validUserProfile("CA Rajesh"), false);
  assert.equal(validUserProfile([]), false);
  assert.equal(
    validUserProfile({
      id: "user-3",
      name: "Test",
      firstName: "Test",
      role: "SuperAdmin", // Not in UserRole
      firmName: "Firm",
      isCustomized: true,
    }),
    false,
  );
  assert.equal(
    validUserProfile({
      id: "user-4",
      name: "   ", // Blank name
      firstName: "Test",
      role: "Owner",
      firmName: "Firm",
      isCustomized: true,
    }),
    false,
  );
  assert.equal(
    validUserProfile({
      id: "user-5",
      name: "Test",
      firstName: "Test",
      role: "Article / Preparer",
      firmName: "", // Blank firm
      isCustomized: true,
    }),
    false,
  );
});

test("extractFirstName handles CA and ADV prefixes gracefully", () => {
  assert.equal(extractFirstName("CA Rajesh Sharma"), "Rajesh");
  assert.equal(extractFirstName("ca Rajesh Sharma"), "Rajesh");
  assert.equal(extractFirstName("ADV Priya Verma"), "Priya");
  assert.equal(extractFirstName("adv Priya Verma"), "Priya");
  assert.equal(extractFirstName("Abhijeet Jha"), "Abhijeet");
  assert.equal(extractFirstName("Naman"), "Naman");
  assert.equal(extractFirstName("   "), "Partner");
});

test("extractInitials computes 2-letter initials ignoring professional prefixes", () => {
  assert.equal(extractInitials("CA Rajesh Sharma"), "RS");
  assert.equal(extractInitials("ADV Priya Verma"), "PV");
  assert.equal(extractInitials("Abhijeet Jha"), "AJ");
  assert.equal(extractInitials("Naman Kumar"), "NK");
  assert.equal(extractInitials("Naman"), "NA");
  assert.equal(extractInitials("   "), "CP");
});
