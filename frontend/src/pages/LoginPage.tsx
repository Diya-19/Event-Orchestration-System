import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import {
  Users,
  Shield,
  Settings,
  Zap,
  Trophy,
} from "lucide-react";

type Mode = "login" | "signup";

export default function LoginPage() {

  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState("organizer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.post("/api/auth/signup", {
          email,
          password,
          name,
          role: role.toLowerCase()
        });
      }
      
      const res = await api.post("/api/auth/login", {
        email,
        password
      });
      
      setToken(res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err.response?.data?.detail) {
        // Backend returns detail string or array
        const detail = err.response.data.detail;
        setError(typeof detail === "string" ? detail : JSON.stringify(detail));
      } else {
        setError(err.message || "Failed to authenticate");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#F7F7FB] flex overflow-hidden">

      {/* LEFT */}

      <div className="
      hidden
      lg:flex
      w-1/2
      flex-col
      justify-center
      px-14
      relative
      ">

        {/* LOGO */}

        <div className="
        absolute
        top-10
        left-10
        flex
        items-center
        gap-3
        ">

          <div className="
          w-12
          h-12
          rounded-xl
          bg-gradient-to-r
          from-purple-500
          to-indigo-600
          flex
          items-center
          justify-center
          text-white
          font-bold
          ">

            H

          </div>

          <h2 className="
          text-3xl
          font-bold
          ">

            HackFlow

          </h2>

        </div>

        <h1 className="
        text-[90px]
        leading-[100px]
        font-bold
        text-slate-900
        ">

          Build. Innovate.

          <br />

          Solve.

          <span className="text-purple-600">

            Impact.

          </span>

        </h1>

        <p className="
        mt-8
        text-gray-500
        text-lg
        max-w-xl
        leading-8
        ">

          Welcome to HackFlow —
          the intelligent platform built
          to streamline hackathons
          from team formation to evaluation.

        </p>

        {/* FEATURES */}

        <div className="
        flex
        gap-14
        mt-24
        ">

          <Feature
            icon={<Users size={28} />}
            title="Collaborate"
            subtitle="Work together"
          />

          <Feature
            icon={<Zap size={28} />}
            title="Innovate"
            subtitle="Build solutions"
          />

          <Feature
            icon={<Trophy size={28} />}
            title="Win"
            subtitle="Compete strong"
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="
      w-full
      lg:w-1/2
      flex
      justify-center
      items-center
      p-8
      ">

        <div className="
        bg-white
        rounded-[34px]
        shadow-xl
        p-10
        w-full
        max-w-xl
        ">

          <h1 className="
          text-5xl
          font-bold
          text-center
          ">

            Welcome to

            <span className="
            text-purple-600
            ">

              HackFlow

            </span>

          </h1>

          <p className="
          text-center
          text-gray-500
          mt-3
          ">

            Choose your role

          </p>

          {/* ROLE */}

          <div className="
          grid
          grid-cols-3
          gap-4
          mt-8
          ">

            <RoleCard
              title="Participant"
              icon={<Users />}
              active={role === "participant"}
              onClick={() => setRole("participant")}
            />

            <RoleCard
              title="Judge"
              icon={<Shield />}
              active={role === "judge"}
              onClick={() => setRole("judge")}
            />

            <RoleCard
              title="Organizer"
              icon={<Settings />}
              active={role === "organizer"}
              onClick={() => setRole("organizer")}
            />

          </div>

          {/* LOGIN SIGNUP */}

          <div className="
          flex
          border
          rounded-xl
          overflow-hidden
          mt-8
          ">

            {(["login", "signup"] as Mode[]).map((item) => (

              <button

                key={item}

                onClick={() =>

                  setMode(item)

                }

                className={`
                flex-1
                py-4
                font-semibold

                ${

                  mode === item

                    ?

                    "bg-purple-600 text-white"

                    :

                    "bg-white text-gray-600"

                  }

                `}
              >

                {

                  item === "login"

                    ?

                    "Login"

                    :

                    "Signup"

                }

              </button>

            ))}

          </div>

          {/* FORM */}

          <div className="
          space-y-4
          mt-8
          ">

            {
              mode === "signup"
              &&
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl p-4 outline-none"
              />
            }

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-4 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full border rounded-xl p-4 outline-none"
            />
            
            {error && <div className="text-red-500 text-sm px-1 font-medium">{error}</div>}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl p-4 font-semibold"
            >
              {loading ? "Please wait..." : (mode === "login" ? "Log In" : "Create Account")}
            </button>

          </div>

          {/* SOCIAL */}

          {/* <div className="
          text-center
          text-gray-400
          my-5
          ">

            continue with

          </div> */}

          {/* <div className="
          space-y-3
          ">

            <SocialButton
            icon={
            <span className="
            text-red-500
            font-bold
            text-lg
            ">

G

</span>
}
text="Google"
/>

           <SocialButton
           icon={
           <div className="
           grid
           grid-cols-2
           gap-[2px]
           ">
            <div className="w-2 h-2 bg-red-500"/>
            <div className="w-2 h-2 bg-green-500"/>
            <div className="w-2 h-2 bg-blue-500"/>
            <div className="w-2 h-2 bg-yellow-400"/>
            </div>
            }
            text="Microsoft"/>

            <SocialButton
              icon={<Mail size={18} />}
              text="Email"
            />

          </div> */}

        </div>

      </div>

    </div>

  );

}

function Feature({
  icon,
  title,
  subtitle
}:{
  icon:React.ReactNode
  title:string
  subtitle:string
}){

return(

<div className="
flex
flex-col
items-center
w-28
text-center
">

<div className="
w-16
h-16
bg-purple-100
rounded-2xl
flex
items-center
justify-center
text-purple-600
">

{icon}

</div>

<h3 className="
font-bold
mt-4
">

{title}

</h3>

<p className="
text-gray-500
text-sm
">

{subtitle}

</p>

</div>

)

}

function RoleCard({
title,
icon,
active,
onClick
}:any){

return(

<button

onClick={onClick}

className={`
border
rounded-2xl
p-6
flex
flex-col
items-center
gap-3

${
active

?

"border-purple-500 bg-purple-50"

:

"border-gray-200"

}

`}

>

{icon}

<p>

{title}

</p>

</button>

)

}

// function SocialButton({
// icon,
// text
// }:any){

// return(

// <button className="
// w-full
// border
// rounded-xl
// p-4
// flex
// justify-center
// items-center
// gap-3
// ">

// {icon}

// <span>

// Continue with {text}

// </span>

// </button>

// )

// }