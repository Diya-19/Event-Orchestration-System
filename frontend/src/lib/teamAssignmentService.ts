export interface AssignedTeam {
  id: string;
  teamId: string;
  teamName: string;
  projectName: string;
  trackName?: string;
  assignedAt?: string;
}

// TODO: Replace mockAssignedTeams with GET /api/committee/assignments/judge/{judgeId}
// Expected API Response:
// interface CommitteeAssignmentResponse {
//   id: string;
//   teamId: string;
//   teamName: string;
//   projectName: string;
//   trackName?: string;
//   assignedAt: string;
// }
const mockAssignedTeams: AssignedTeam[] = [
  {
    id: "assign-1",
    teamId: "mock-team-1", // Will be overridden/merged by real evaluations to preserve workflow
    teamName: "Team Nexus 1",
    projectName: "AI Interview Coach",
    trackName: "AI Innovation",
    assignedAt: new Date().toISOString()
  },
  {
    id: "assign-2",
    teamId: "mock-team-2",
    teamName: "Team Pulse 2",
    projectName: "Healthcare App",
    trackName: "HealthTech",
    assignedAt: new Date().toISOString()
  }
];

export const getAssignedTeams = (): AssignedTeam[] => {
  return [...mockAssignedTeams];
};

export const getAssignedTeamsCount = (): number => {
  return mockAssignedTeams.length;
};

export const getAssignedTeamById = (teamId: string): AssignedTeam | undefined => {
  return mockAssignedTeams.find(t => t.teamId === teamId);
};

export const mergeAssignmentStatus = (assignments: AssignedTeam[], evaluations: any[]) => {
  // Combine Committee Assignment Data + Judge Evaluation Status Data
  // To preserve existing functionality without breaking real workflows, 
  // we map the real evaluations to the assignment structure, using the mock data as a fallback.
  
  // Create a map of real evaluations
  const evalMap = new Map();
  if (evaluations) {
    evaluations.forEach(e => {
      evalMap.set(e.team_id || e.teamId, e);
    });
  }

  // If there are real evaluations from the API, we must ensure they are in the merged output 
  // so the dashboard routing and evaluate buttons continue to work with real UUIDs.
  const merged = evaluations.map(e => {
    // Try to find a matching mock assignment by name (since mock IDs are fake)
    const assignment = assignments.find(a => a.teamName === e.team_name) || {
      id: `assign-${e.team_id}`,
      teamId: e.team_id,
      teamName: e.team_name,
      projectName: e.project_name || "Project",
      trackName: e.challenge,
      assignedAt: new Date().toISOString()
    };
    
    // Map existing backend status string to the new UI enum
    let statusEnum: "not_started" | "draft" | "in_progress" | "submitted" = "not_started";
    if (e.status === "Draft") statusEnum = "draft";
    if (e.status === "Submitted") statusEnum = "submitted";
    if (e.status === "In Progress") statusEnum = "in_progress";

    return {
      ...assignment,
      teamId: e.team_id, // Ensure real ID is used for routing
      teamName: e.team_name,
      trackName: e.challenge,
      status: statusEnum,
      evaluationId: e.evaluation_id || null,
      overallScore: e.overall_score || null,
      submittedAt: e.submitted_at || null,
      originalEval: e // keep reference if needed
    };
  });

  return merged;
};

export const calculateEvaluationMetrics = (mergedTeams: any[]) => {
  const assignedCount = mergedTeams.length;
  const completedCount = mergedTeams.filter((t: any) => t.status === "submitted").length;
  const draftCount = mergedTeams.filter((t: any) => t.status === "draft" || t.status === "in_progress").length;
  const pendingCount = assignedCount - completedCount - draftCount;

  return { assignedCount, completedCount, draftCount, pendingCount };
};
