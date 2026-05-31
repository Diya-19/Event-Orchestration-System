import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Login failed");
  }
  return res.json();
}

async function apiSignup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Signup failed");
  }
  return res.json();
}

export default function LoginPage() {
  const navigate = useNavigate();
  
  // UI State
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState("Admin"); // Defaulted to Admin for committee portal

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      let data: AuthResponse;
      if (mode === "login") {
        data = await apiLogin(email, password);
      } else {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        data = await apiSignup(name.trim(), email, password);
      }
      
      // Store token and redirect
      localStorage.setItem("committee_token", data.access_token);
      navigate("/dashboard");
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex overflow-hidden">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-14 relative">
        {/* LOGO */}
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            H
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

          {/* ROLE (Visual Only for now, but retains your UI) */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <RoleCard
              title="Participant"
              icon={<Users />}
              active={role === "Participant"}
              onClick={() => setRole("Participant")}
            />
            <RoleCard
              title="Judge"
              icon={<Shield />}
              active={role === "Judge"}
              onClick={() => setRole("Judge")}
            />
            <RoleCard
              title="Admin"
              icon={<Settings />}
              active={role === "Admin"}
              onClick={() => setRole("Admin")}
            />
          </div>

          {/* LOGIN / SIGNUP TOGGLE */}
          <div className="flex border rounded-xl overflow-hidden mt-8">
            {(["login", "signup"] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError(""); // Clear errors when switching modes
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

            {/* ERROR MESSAGE */}
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
                : (mode === "login" ? "Log In" : "Create Account")
              }
            </button>
          </form>

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