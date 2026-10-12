import assert from "node:assert/strict";
import { test } from "node:test";
import { getHomeMetricValues } from "../../src/lib/dashboard-metrics.ts";

const project = (id, status) => ({
  id,
  name: id,
  client: "Client",
  status,
  progress: 0,
  due: "2026-10-20",
  lead: "Owner",
  category: "Audit",
});

test("home metrics reflect workspace projects and recorded time", () => {
  assert.deepEqual(
    getHomeMetricValues(
      [project("active", "In progress"), project("done", "Completed")],
      [
        { id: "1", date: "2026-10-12", project: "active", seconds: 3600 },
        { id: "2", date: "2026-10-12", project: "active", seconds: 900 },
      ],
    ),
    { total: "2", active: "1", completed: "1", hours: "1.3hrs" },
  );
});

test("home metrics show zeroes for an empty workspace", () => {
  assert.deepEqual(getHomeMetricValues([], []), {
    total: "0",
    active: "0",
    completed: "0",
    hours: "0hrs",
  });
});
