export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  eventId?: string;
  eventName?: string;
  priority?: "critical" | "high" | "medium" | "low";
  status?: "active" | "completed" | "expired";
}

// TODO: Replace mock deadlines with Committee API
// TODO: Fetch deadlines from GET /api/committee/deadlines
// TODO: Filter deadlines by judge's assigned events
const mockDeadlines: Deadline[] = [
  {
    id: "1",
    title: "Evaluation Submission",
    description: "Submit all assigned team evaluations for the current phase.",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // +12 hours
    eventId: "event-1",
    status: "active"
  },
  {
    id: "2",
    title: "Round 2 Evaluation",
    description: "Evaluate teams shortlisted for Round 2.",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // +2 days
    eventId: "event-1",
    status: "active"
  },
  {
    id: "3",
    title: "Team Feedback Review",
    description: "Provide final feedback comments to all evaluated teams.",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // +5 days
    eventId: "event-1",
    status: "active"
  },
  {
    id: "4",
    title: "Final Report Review",
    description: "Review and approve the generated final report for the track.",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // +10 days
    eventId: "event-1",
    status: "active"
  },
  {
    id: "5",
    title: "Phase 1 Deadline",
    description: "Initial phase grading cutoff.",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // -2 days
    eventId: "event-1",
    status: "expired"
  }
];

export const getPriority = (deadline: Deadline): "critical" | "high" | "medium" | "low" => {
  if (deadline.priority) return deadline.priority;

  const due = new Date(deadline.dueDate).getTime();
  const now = Date.now();
  const diffHours = (due - now) / (1000 * 60 * 60);

  if (diffHours < 0) return "critical"; // Expired is critical for UI sorting
  if (diffHours < 24) return "critical";
  if (diffHours < 24 * 3) return "high";
  if (diffHours < 24 * 7) return "medium";
  return "low";
};

export const getRemainingTime = (deadline: Deadline): string => {
  const due = new Date(deadline.dueDate).getTime();
  const now = Date.now();
  const diffMs = due - now;
  const isExpired = diffMs < 0;
  
  const absDiffMs = Math.abs(diffMs);
  const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((absDiffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((absDiffMs / (1000 * 60)) % 60);

  if (isExpired) {
    if (diffDays > 0) return `Expired ${diffDays}d ago`;
    return `Expired ${diffHours}h ${diffMinutes}m ago`;
  }

  if (diffDays > 0) {
    if (diffHours === 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    return `${diffDays}d ${diffHours}h remaining`;
  }
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m remaining`;
  }
  
  return `${diffMinutes}m remaining`;
};

export const getAllDeadlines = (): Deadline[] => {
  // Return a sorted copy of all mock deadlines
  return [...mockDeadlines].map(d => ({
    ...d,
    priority: getPriority(d)
  })).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const getUpcomingDeadlines = (): Deadline[] => {
  return getAllDeadlines().filter(d => {
    const due = new Date(d.dueDate).getTime();
    return due >= Date.now();
  });
};