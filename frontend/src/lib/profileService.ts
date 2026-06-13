// TODO:
// Replace local avatar storage with backend API integration when available:
//
// PUT /api/judge/profile/avatar
// GET /api/judge/profile

export interface JudgeProfile {
  name: string;
  email: string;
  organization: string;
  designation: string;
  bio: string;
  avatar: string;
  skills: string[];
}

const DEFAULT_PROFILE: JudgeProfile = {
  name: "Not Available",
  email: "Not Available",
  organization: "Not Available",
  designation: "Judge",
  bio: "Professional bio will appear here once added.",
  avatar: "",
  skills: [
    "AI/ML", "Web Development", "Cloud Computing", "Cybersecurity", 
    "Data Science", "Blockchain", "IoT", "Product Design", 
    "System Architecture", "DevOps", "UI/UX", "Mobile Apps"
  ]
};

const PROFILE_STORAGE_KEY = 'judge_profile';

export const getProfileData = (): JudgeProfile => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
};

export const saveProfileData = (profile: JudgeProfile): void => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const getProfileAvatar = (): string => {
  return getProfileData().avatar;
};

export const saveProfileAvatar = (avatarBase64: string): void => {
  const profile = getProfileData();
  profile.avatar = avatarBase64;
  saveProfileData(profile);
};