import { api } from "./api";

export interface DashboardResponse {
  participant: {
    id: string;
    name: string;
    email: string;
  };
  team: {
    id: string;
    name: string;
    registration_id: string | null;
  } | null;
  members: {
    id: string;
    name: string;
  }[];
  event: {
    name: string;
    theme: string;
    current_stage: string;
    start_date: string;
    end_date: string;
    submission_deadline: string;
    evaluation_start: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  institution: string;
  skills: string[];
}

export interface TeamDetailsResponse {
  team: {
    id: string;
    name: string;
    registration_id: string | null;
  };
  track: {
    id: string;
    name: string;
  } | null;
  mentor: {
    id: string;
    name: string;
  } | null;
  members: TeamMember[];
}

export interface SubmissionResponse {
  id?: string;
  team_id?: string;
  event_id?: string;
  github_link: string | null;
  project_description: string | null;
  presentation_url: string | null;
  demo_video_url: string | null;
  status?: string;
  participant_notes: string | null;
  is_final_submitted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const participantService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const res = await api.get("/api/participant/dashboard");
    return res.data;
  },

  getTeamDetails: async (): Promise<TeamDetailsResponse> => {
    const res = await api.get("/api/participant/team");
    return res.data;
  },

  getSubmission: async (): Promise<SubmissionResponse | null> => {
    const res = await api.get("/api/participant/submission");
    return res.data;
  },

  saveSubmission: async (data: Partial<SubmissionResponse>): Promise<SubmissionResponse> => {
    const res = await api.post("/api/participant/submission", data);
    return res.data;
  }
};