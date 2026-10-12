import type { Project, TimeEntry } from "@/types/workspace";

export function getHomeMetricValues(
  projects: Project[],
  entries: TimeEntry[],
): Record<string, string> {
  const completed = projects.filter(
    (project) => project.status.toLowerCase() === "completed",
  ).length;
  const active = projects.filter(
    (project) =>
      !["completed", "archived"].includes(project.status.toLowerCase()),
  ).length;
  const hours =
    entries.reduce((total, entry) => total + entry.seconds, 0) / 3600;

  return {
    total: String(projects.length),
    active: String(active),
    completed: String(completed),
    hours: `${Number.isInteger(hours) ? hours : hours.toFixed(1)}hrs`,
  };
}
