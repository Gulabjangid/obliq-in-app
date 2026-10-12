import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatDate,
  formatRelativeTime,
  isOverdueDate,
} from "../../src/lib/format.ts";

const now = Date.parse("2026-10-12T12:00:00.000Z");

test("formats recent activity from its timestamp", () => {
  assert.equal(formatRelativeTime("2026-10-12T11:59:45.000Z", now), "Just now");
  assert.equal(formatRelativeTime("2026-10-12T10:00:00.000Z", now), "2 hr ago");
  assert.equal(
    formatRelativeTime("2026-10-11T11:00:00.000Z", now),
    "Yesterday",
  );
});

test("handles invalid activity timestamps", () => {
  assert.equal(formatRelativeTime("not a timestamp", now), "Time unavailable");
});

test("formats supported project due dates and reports invalid dates safely", () => {
  assert.notEqual(formatDate("2026-10-14"), "Date unavailable");
  assert.notEqual(formatDate("October 14, 2026"), "Date unavailable");
  assert.equal(formatDate("not a date"), "Date unavailable");
});

test("identifies overdue dates without treating invalid dates as overdue", () => {
  assert.equal(isOverdueDate("2026-10-11", "2026-10-12"), true);
  assert.equal(isOverdueDate("2026-10-12", "2026-10-12"), false);
  assert.equal(isOverdueDate("not a date", "2026-10-12"), false);
});
