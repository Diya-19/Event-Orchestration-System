const KEY = "committee_token";
const JUDGE_KEY = "evaluator_token";

export const getToken = (): string | null => localStorage.getItem(KEY);
export const setToken = (t: string): void => localStorage.setItem(KEY, t);
export const clearToken = (): void => localStorage.removeItem(KEY);
export const isLoggedIn = (): boolean => !!getToken();
// export const isLoggedIn = () => true; // ⚠️ TEMP FOR DEV ONLY - REVERT BEFORE SUBMITTING

// Judge Authentication Helpers
export const getJudgeToken = (): string | null => localStorage.getItem(JUDGE_KEY);
export const setJudgeToken = (t: string): void => localStorage.setItem(JUDGE_KEY, t);
export const clearJudgeToken = (): void => localStorage.removeItem(JUDGE_KEY);
export const isJudgeLoggedIn = (): boolean => !!getJudgeToken();

// Participant Authentication Helpers
const PARTICIPANT_KEY = "participant_token";
export const getParticipantToken = (): string | null => localStorage.getItem(PARTICIPANT_KEY);
export const setParticipantToken = (t: string): void => localStorage.setItem(PARTICIPANT_KEY, t);
export const clearParticipantToken = (): void => localStorage.removeItem(PARTICIPANT_KEY);
export const isParticipantLoggedIn = (): boolean => !!getParticipantToken();