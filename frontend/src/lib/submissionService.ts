export interface Deliverable {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'demo' | 'document' | 'video' | 'other';
}

export interface ProjectSubmission {
  teamId: string;
  projectName: string;
  summary: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  deliverables: Deliverable[];
  submittedAt?: string;
}

// TODO: Replace mockSubmissions with GET /api/participant/submissions/{teamId}
// Expected API Response:
// interface ParticipantSubmissionResponse {
//   teamId: string;
//   projectName: string;
//   summary: string;
//   description: string;
//   githubUrl?: string;
//   demoUrl?: string;
//   deliverables: Deliverable[];
//   submittedAt: string;
// }

const mockSubmissions: ProjectSubmission[] = [
  {
    teamId: "mock-team-1", // This will be used as fallback or replaced dynamically in a real app, but right now we match against real DB UUIDs if known. Actually, we'll return this mock data for ANY team if we don't have it, to test the UI.
    projectName: "AI Interview Coach",
    summary: "An AI-powered application that simulates technical interviews and provides real-time feedback.",
    description: "Our project uses advanced LLMs to conduct voice-based technical interviews. It analyzes tone, technical accuracy, and confidence to provide a comprehensive report for candidates preparing for SWE roles.",
    githubUrl: "https://github.com/example/ai-interview",
    demoUrl: "https://ai-interview-demo.example.com",
    deliverables: [
      {
        id: "del-1",
        title: "Architecture Diagram",
        url: "https://example.com/arch.pdf",
        type: "document"
      },
      {
        id: "del-2",
        title: "Product Pitch Video",
        url: "https://youtube.com/watch?v=example",
        type: "video"
      }
    ],
    submittedAt: new Date().toISOString()
  }
];

export const getSubmissionByTeamId = (teamId: string): ProjectSubmission | null => {
  // TODO:
  // Temporary mock implementation.
  //
  // Currently returns the same mock submission for all teams.
  //
  // When Participant APIs are implemented,
  // replace with:
  //
  // GET /api/participant/submissions/{teamId}
  //
  // and return the actual submission
  // associated with the requested team.
  return {
    ...mockSubmissions[0],
    teamId: teamId
  };
};