import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Shield,
  Settings,
  Zap,
  Trophy,
} from "lucide-react";

type Mode = "login" | "signup";

interface AuthResponse {
  access_token: string;
  token_type: string;
}

import { api } from "../lib/api";

async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail ?? "Login failed");
  }
}

async function apiSignup(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await api.post("/api/auth/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail ?? "Signup failed");
  }
}

async function apiParticipantLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await api.post("/api/auth/participant-login", { email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail ?? "Login failed");
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const participantTokenParam = searchParams.get("participant_token");
  const eventIdParam = searchParams.get("event_id") ?? "";

  // UI State
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState("Admin"); // Defaulted to Admin for committee portal

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Judge link-request state
  const [judgeEmail, setJudgeEmail] = useState("");
  const [judgeLinkSent, setJudgeLinkSent] = useState(false);
  const [judgeLinkLoading, setJudgeLinkLoading] = useState(false);

  // Participant link-request state
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantLinkSent, setParticipantLinkSent] = useState(false);
  const [participantLinkLoading, setParticipantLinkLoading] = useState(false);

  // Auto-verify judge invitation links
  useEffect(() => {
    if (tokenParam) {
      const verifyToken = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/auth/verify-judge?token=${tokenParam}`);
          const data = res.data;
          localStorage.setItem("evaluator_token", data.access_token);
          navigate("/judge");
        } catch (err: any) {
          setError(err.response?.data?.detail ?? "Invalid or expired invitation link");
          setRole("Judge"); // Visually set them to Judge role for context
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    }
  }, [tokenParam, navigate, searchParams, setSearchParams]);

  // Auto-verify participant invitation links
  useEffect(() => {
    if (participantTokenParam) {
      const verifyToken = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/auth/verify-participant?token=${participantTokenParam}`);
          localStorage.setItem("participant_token", res.data.access_token);
          navigate("/participant");
        } catch (err: any) {
          setError(err.response?.data?.detail ?? "Invalid or expired access link");
          setRole("Participant");
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    }
  }, [participantTokenParam, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data: AuthResponse;
      if (mode === "login") {
        if (role === "Participant") {
          data = await apiParticipantLogin(email, password);
        } else {
          data = await apiLogin(email, password);
        }
      } else {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        data = await apiSignup(name.trim(), email, password);
      }

      // Store token and redirect
      if (role === "Participant") {
        localStorage.setItem("participant_token", data.access_token);
        navigate("/participant");
      } else {
        localStorage.setItem("committee_token", data.access_token);
        navigate("/dashboard");
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestJudgeLink(e: FormEvent) {
    e.preventDefault();
    if (!judgeEmail.trim()) return;
    setJudgeLinkLoading(true);
    try {
      await api.post("/api/auth/request-judge-link", {
        email: judgeEmail.trim(),
        event_id: eventIdParam,
      });
    } catch {
      // Swallow — we show the same message regardless to avoid enumeration
    } finally {
      setJudgeLinkLoading(false);
      setJudgeLinkSent(true);
    }
  }

  async function handleRequestParticipantLink(e: FormEvent) {
    e.preventDefault();
    if (!participantEmail.trim()) return;
    setParticipantLinkLoading(true);
    try {
      await api.post("/api/auth/request-participant-link", {
        email: participantEmail.trim(),
        event_id: eventIdParam,
      });
    } catch {
      // Swallow — anti-enumeration
    } finally {
      setParticipantLinkLoading(false);
      setParticipantLinkSent(true);
    }
  }

  // --- Dedicated Invitation Verification Screen ---
  if (tokenParam) {
    return (
      <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-4">
        <div className="bg-white rounded-[34px] shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-3">Judge Invitation</h2>

          {!error ? (
            <div className="space-y-4">
              <p className="text-gray-500">Verifying invitation securely...</p>
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mt-4"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
              <button
                onClick={() => {
                  searchParams.delete("token");
                  setSearchParams(searchParams);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 font-semibold transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Participant Link Verification Screen ---
  if (participantTokenParam) {
    return (
      <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-4">
        <div className="bg-white rounded-[34px] shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6">
            <Users size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-3">Participant Access</h2>

          {!error ? (
            <div className="space-y-4">
              <p className="text-gray-500">Verifying your access link...</p>
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mt-4"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
              <button
                onClick={() => {
                  searchParams.delete("participant_token");
                  setSearchParams(searchParams);
                  setRole("Participant");
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 font-semibold transition-colors"
              >
                Request a New Link
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex overflow-hidden">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-14 relative">
        {/* LOGO */}
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center shadow-md text-lg">
                ✦
          </div>
          <h2 className="text-3xl font-bold">HackFlow</h2>
        </div>

        <h1 className="text-[90px] leading-[100px] font-bold text-slate-900">
          Build. Innovate.
          <br />
          Solve.
          <span className="text-purple-600"> Impact.</span>
        </h1>

        <p className="mt-8 text-gray-500 text-lg max-w-xl leading-8">
          Welcome to HackFlow — the intelligent platform built to streamline hackathons from team formation to evaluation.
        </p>

        {/* FEATURES */}
        <div className="flex gap-14 mt-24">
          <Feature icon={<Users size={28} />} title="Collaborate" subtitle="Work together" />
          <Feature icon={<Zap size={28} />} title="Innovate" subtitle="Build solutions" />
          <Feature icon={<Trophy size={28} />} title="Win" subtitle="Compete strong" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="bg-white rounded-[34px] shadow-xl p-10 w-full max-w-xl">
          <h1 className="text-5xl font-bold text-center">
            Welcome to <span className="text-purple-600">HackFlow</span>
          </h1>

          <p className="text-center text-gray-500 mt-3">Choose your role</p>

          {/* ROLE */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <RoleCard
              title="Participant"
              icon={<Users />}
              active={role === "Participant"}
              onClick={() => { setRole("Participant"); setParticipantLinkSent(false); }}
            />
            <RoleCard
              title="Judge"
              icon={<Shield />}
              active={role === "Judge"}
              onClick={() => { setRole("Judge"); setJudgeLinkSent(false); }}
            />
            <RoleCard
              title="Admin"
              icon={<Settings />}
              active={role === "Admin"}
              onClick={() => setRole("Admin")}
            />
          </div>

          {/* JUDGE: magic-link request panel */}
          {role === "Judge" ? (
            <div className="mt-8">
              {judgeLinkSent ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
                    <Shield size={28} />
                  </div>
                  <p className="font-semibold text-gray-800">Check your email</p>
                  <p className="text-gray-500 text-sm">
                    If that email is registered as a judge, you'll receive a login link shortly.
                  </p>
                  <button
                    onClick={() => { setJudgeLinkSent(false); setJudgeEmail(""); }}
                    className="text-purple-600 text-sm underline"
                  >
                    Try a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestJudgeLink} className="space-y-4">
                  <p className="text-sm text-gray-500 text-center">
                    Judges log in via a personal link sent by the event organiser.
                    Enter your email to receive a new link.
                  </p>
                  <input
                    type="email"
                    placeholder="Your judge email"
                    value={judgeEmail}
                    onChange={(e) => setJudgeEmail(e.target.value)}
                    required
                    className="w-full border rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={judgeLinkLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white rounded-xl p-4 font-semibold transition-colors"
                  >
                    {judgeLinkLoading ? "Sending..." : "Request Access Link"}
                  </button>
                </form>
              )}
            </div>
          ) : role === "Participant" ? (
            /* PARTICIPANT: magic-link request panel */
            <div className="mt-8">
              {participantLinkSent ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
                    <Users size={28} />
                  </div>
                  <p className="font-semibold text-gray-800">Check your email</p>
                  <p className="text-gray-500 text-sm">
                    If that email is registered as a participant, you'll receive a login link shortly.
                  </p>
                  <button
                    onClick={() => { setParticipantLinkSent(false); setParticipantEmail(""); }}
                    className="text-purple-600 text-sm underline"
                  >
                    Try a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestParticipantLink} className="space-y-4">
                  <p className="text-sm text-gray-500 text-center">
                    Participants log in via a personal link sent after team approval.
                    Enter your email to receive a new link.
                  </p>
                  <input
                    type="email"
                    placeholder="Your participant email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    required
                    className="w-full border rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={participantLinkLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white rounded-xl p-4 font-semibold transition-colors"
                  >
                    {participantLinkLoading ? "Sending..." : "Request Access Link"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* LOGIN / SIGNUP TOGGLE */}
              <div className="flex border rounded-xl overflow-hidden mt-8">
                {(["login", "signup"] as Mode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMode(item);
                      setError("");
                    }}
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      mode === item ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item === "login" ? "Login" : "Signup"}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                {mode === "signup" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full border rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full border rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white rounded-xl p-4 font-semibold transition-colors"
                >
                  {loading
                    ? (mode === "login" ? "Logging in..." : "Creating Account...")
                    : (mode === "login" ? "Log In" : "Create Account")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center w-28 text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
        {icon}
      </div>
      <h3 className="font-bold mt-4">{title}</h3>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function RoleCard({
  title,
  icon,
  active,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button" // Prevents accidentally submitting the form when clicking a role
      onClick={onClick}
      className={`border rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors ${
        active ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-purple-200"
      }`}
    >
      {icon}
      <p className="font-medium">{title}</p>
    </button>
  );
}