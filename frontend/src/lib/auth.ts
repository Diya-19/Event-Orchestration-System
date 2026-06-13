const KEY = "committee_token";

export const getToken = (): string | null => localStorage.getItem(KEY);
export const setToken = (t: string): void => localStorage.setItem(KEY, t);
export const clearToken = (): void => localStorage.removeItem(KEY);
export const isLoggedIn = (): boolean => !!getToken();
// export const isLoggedIn = () => true; // ⚠️ TEMP FOR DEV ONLY - REVERT BEFORE SUBMITTING

const JUDGE_KEY = "evaluator_token";

// Judge Authentication Helpers
export const getJudgeToken = (): string | null => localStorage.getItem(JUDGE_KEY);
export const setJudgeToken = (t: string): void => localStorage.setItem(JUDGE_KEY, t);
export const clearJudgeToken = (): void => localStorage.removeItem(JUDGE_KEY);
export const isJudgeLoggedIn = (): boolean => !!getJudgeToken();