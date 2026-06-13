export interface ActivityItem {
  id: string;
  action: string;
  teamName: string;
  teamId: string;
  timestamp: string;
  source: "local" | "api";
}

const STORAGE_KEY = "judge_activities";

export const getActivities = (): ActivityItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse activities from local storage", error);
    return [];
  }
};

export const logActivity = (action: string, teamName: string, teamId: string) => {
  // TODO: Replace this entire frontend caching mechanism with a real backend API call
  // once POST /api/judge/activity is implemented.
  
  const activities = getActivities();
  const now = new Date();

  // Prevent duplicate "Evaluation Started" if clicked within the last 5 minutes
  if (action === "Evaluation Started") {
    const recentDuplicate = activities.find(
      (a) =>
        a.action === action &&
        a.teamId === teamId &&
        now.getTime() - new Date(a.timestamp).getTime() < 5 * 60 * 1000
    );
    if (recentDuplicate) return;
  }

  const newActivity: ActivityItem = {
    id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    teamName,
    teamId,
    timestamp: now.toISOString(),
    source: "local",
  };

  activities.unshift(newActivity);

  // Keep only the 50 most recent events
  const limitedActivities = activities.slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedActivities));
  
  // Dispatch event so dashboard can instantly refresh
  window.dispatchEvent(new Event("activity_logged"));
};

export const formatRelativeTime = (timestamp: string): string => {
  const diffInSeconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  
  return `${diffInDays} days ago`;
};

export const mergeApiActivities = (apiEvaluations: any[]): ActivityItem[] => {
  // Derive historical submission activities directly from the API state
  const derivedActivities: ActivityItem[] = [];
  
  apiEvaluations.forEach((evalData) => {
    if (evalData.status === "Submitted" && evalData.submitted_at) {
      derivedActivities.push({
        id: `api-sub-${evalData.team_id}`,
        action: "Evaluation Submitted",
        teamName: evalData.team_name,
        teamId: evalData.team_id,
        timestamp: evalData.submitted_at,
        source: "api"
      });
    }
  });

  const localActivities = getActivities();
  
  // Merge and sort
  const all = [...derivedActivities, ...localActivities];
  
  // Deduplicate: If an API submission exists, prefer it over a local submission for the same team
  const seenSubmissions = new Set();
  const deduped: ActivityItem[] = [];
  
  all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  for (const item of all) {
    if (item.action === "Evaluation Submitted") {
      if (seenSubmissions.has(item.teamId)) continue;
      seenSubmissions.add(item.teamId);
    }
    deduped.push(item);
  }

  return deduped.slice(0, 50);
};