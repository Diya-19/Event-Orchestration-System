import RoleCard from "../components/RoleCard"

export default function WelcomePage() {

  return (

    <div className="min-h-screen flex bg-[#FAFAFC]">

      {/* LEFT */}

      <div className="w-1/2 flex flex-col justify-center px-20">

        <h1 className="text-7xl font-bold leading-tight">

          Build. Innovate.
          <br />

          Solve.

          <span className="text-purple-600">

            {" "}Impact.

          </span>

        </h1>

        <p className="mt-6 text-gray-500 max-w-lg">

          Welcome to HackFlow — intelligent platform
          built to streamline hackathons.

        </p>

        <div className="flex gap-10 mt-16">

          <Feature
           title="Collaborate"
           text="Work together"
          />

          <Feature
           title="Innovate"
           text="Solve challenges"
          />

          <Feature
           title="Win"
           text="Compete"
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="w-1/2 flex justify-center items-center">

       <div className="bg-white shadow-xl rounded-3xl p-10 w-[500px]">

        <h2 className="text-4xl font-bold">

          Welcome to

          <span className="text-purple-600">

            {" "}HackFlow

          </span>

        </h2>

        <p className="text-gray-500 mt-2">

          Choose role

        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">

         <RoleCard title="Participant"/>

         <RoleCard title="Judge"/>

         <RoleCard title="Admin"/>

        </div>

        <div className="mt-8 space-y-4">

         <button className="w-full border p-4 rounded-xl">

          Continue with Google

         </button>

         <button className="w-full border p-4 rounded-xl">

          Continue with Microsoft

         </button>

         <button className="w-full border p-4 rounded-xl">

          Continue with Email

         </button>

        </div>

       </div>

      </div>

    </div>

  )

}

function Feature({
 title,
 text
}:{
 title:string
 text:string
}){

 return(

  <div>

   <div
    className="
    w-14
    h-14
    bg-purple-100
    rounded-xl
    "
   />

   <h3 className="font-semibold mt-2">

    {title}

   </h3>

   <p className="text-gray-500">

    {text}

   </p>

  </div>

 )

}