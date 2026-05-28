export default function TeamFormation() {

  const teams = [
    {
      id: 1,
      name: "Team Orion",
      members: [
        {
          name: "Rahul Sharma",
          role: "Full Stack Developer",
          skills: ["React", "Node.js"]
        },
        {
          name: "Disha Patel",
          role: "UI/UX Designer",
          skills: ["Figma", "UI Design"]
        },
        {
          name: "Amit Verma",
          role: "ML Engineer",
          skills: ["Python", "TensorFlow"]
        },
        {
          name: "Sneha Iyer",
          role: "Backend Developer",
          skills: ["Java", "Spring Boot"]
        }
      ]
    },

    {
      id: 2,
      name: "Team Nova",
      members: [
        {
          name: "Karan Mehta",
          role: "Full Stack Developer",
          skills: ["React", "Node.js"]
        },
        {
          name: "Priya Nair",
          role: "Data Scientist",
          skills: ["Python", "Pandas"]
        },
        {
          name: "Vivek Singh",
          role: "DevOps Engineer",
          skills: ["AWS", "Docker"]
        },
        {
          name: "Ananya Rao",
          role: "UI/UX Designer",
          skills: ["Figma", "Prototyping"]
        }
      ]
    },

    {
      id: 3,
      name: "Team Zenith",
      members: [
        {
          name: "Arjun Kapoor",
          role: "Mobile Developer",
          skills: ["Flutter", "Dart"]
        },
        {
          name: "Meera Joshi",
          role: "Backend Developer",
          skills: ["Java", "Spring Boot"]
        },
        {
          name: "Siddharth Jain",
          role: "ML Engineer",
          skills: ["Python", "Scikit-learn"]
        },
        {
          name: "Pooja Sharma",
          role: "UI/UX Designer",
          skills: ["Figma", "UI Design"]
        }
      ]
    }
  ];

  return (

    <div className="
    min-h-screen
    bg-[#f7f5fb]
    px-7
    py-7
    ">

      {/* HEADER */}

      <div>

        <h1 className="
        text-[44px]
        font-bold
        text-slate-900
        tracking-[-1px]
        ">

          Team Formation

        </h1>

        <p className="
        text-[#667085]
        mt-2
        text-[15px]
        ">

          Generate and manage teams automatically or with AI to ensure balanced and effective collaboration.

        </p>

      </div>

      {/* GENERATE CARD */}

      <div className="
      bg-white
      border
      border-[#ece8f3]
      rounded-[26px]
      p-8
      mt-7
      shadow-[0_2px_12px_rgba(0,0,0,0.03)]
      ">

        <div className="
        flex
        items-center
        justify-between
        ">

          {/* LEFT */}

          <div>

            <h2 className="
            text-[28px]
            font-bold
            text-slate-900
            ">

              Generate Teams

            </h2>

            <p className="
            text-[#667085]
            mt-1
            text-sm
            ">

              Choose a method to generate teams for the participants.

            </p>

            <div className="
            flex
            gap-5
            mt-6
            ">

              {/* RANDOM */}

              <div className="
              w-[340px]
              border-2
              border-[#8b5cf6]
              rounded-[22px]
              p-6
              bg-[#fcfaff]
              relative
              ">

                <div className="
                absolute
                top-4
                right-4
                w-6
                h-6
                rounded-full
                bg-[#8b5cf6]
                text-white
                text-[11px]
                flex
                items-center
                justify-center
                ">

                  ✓

                </div>

                <div className="
                w-14
                h-14
                rounded-2xl
                bg-[#f3e8ff]
                flex
                items-center
                justify-center
                text-[24px]
                ">

                  👥

                </div>

                <h3 className="
                mt-5
                text-[28px]
                font-bold
                ">

                  Random

                </h3>

                <p className="
                text-[#667085]
                mt-2
                leading-7
                text-[15px]
                ">

                  Randomly generate teams based on skills and preferences.

                </p>

              </div>

              {/* AI */}

              <div className="
              w-[340px]
              border
              border-[#e7e4ef]
              rounded-[22px]
              p-6
              bg-white
              ">

                <div className="
                w-14
                h-14
                rounded-2xl
                bg-[#f3e8ff]
                flex
                items-center
                justify-center
                text-[24px]
                ">

                  ✨

                </div>

                <h3 className="
                mt-5
                text-[28px]
                font-bold
                ">

                  AI Powered (LLM)

                </h3>

                <p className="
                text-[#667085]
                mt-2
                leading-7
                text-[15px]
                ">

                  Use AI to form optimal teams based on skills, experience and goals.

                </p>

              </div>

            </div>

          </div>

          {/* BUTTON */}

          <div className="text-center">

            <button className="
            bg-gradient-to-r
            from-[#7c3aed]
            to-[#9333ea]
            text-white
            px-10
            py-5
            rounded-2xl
            font-semibold
            shadow-lg
            hover:scale-[1.02]
            transition
            text-[17px]
            ">

              ✨ Generate Teams

            </button>

            <p className="
            text-[#667085]
            text-sm
            mt-4
            max-w-[230px]
            leading-6
            ">

              AI mode will provide rationale for each team formation.

            </p>

          </div>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="
      grid
      grid-cols-12
      gap-6
      mt-7
      ">

        {/* LEFT */}

        <div className="
        col-span-9
        ">

          {/* TOP BAR */}

          <div className="
          flex
          justify-between
          items-center
          mb-5
          ">

            <div className="flex items-center gap-4">

              <h2 className="
              text-[34px]
              font-bold
              tracking-[-1px]
              ">

                Generated Teams

              </h2>

              <div className="
              bg-[#f3e8ff]
              text-[#7c3aed]
              px-4
              py-1
              rounded-full
              text-sm
              font-medium
              ">

                6 Teams

              </div>

            </div>

            {/* SEARCH */}

            <div className="flex gap-4">

              <input
                placeholder="🔍  Search teams..."
                className="
                w-[240px]
                border
                border-[#ebe7f2]
                bg-white
                rounded-2xl
                px-5
                py-3
                outline-none
                text-sm
                "
              />

              <button className="
              border
              border-[#ebe7f2]
              bg-white
              rounded-2xl
              px-6
              py-3
              font-medium
              hover:bg-gray-50
              ">

                ↻ Regenerate

              </button>

            </div>

          </div>

          {/* TEAM CARDS */}

          <div className="space-y-5">

            {

              teams.map((team) => (

                <div
                  key={team.id}
                  className="
                  bg-white
                  border
                  border-[#ebe7f2]
                  rounded-[28px]
                  p-5
                  shadow-[0_2px_12px_rgba(0,0,0,0.03)]
                  "
                >

                  {/* HEADER */}

                  <div className="
                  flex
                  justify-between
                  items-center
                  ">

                    <div className="flex items-center gap-4">

                      <div className="
                      w-9
                      h-9
                      rounded-xl
                      bg-[#9333ea]
                      text-white
                      text-sm
                      font-bold
                      flex
                      items-center
                      justify-center
                      ">

                        {team.id}

                      </div>

                      <h2 className="
                      text-[30px]
                      font-bold
                      tracking-[-0.5px]
                      ">

                        {team.name}

                      </h2>

                    </div>

                    <div className="
                    flex
                    items-center
                    gap-5
                    text-[#667085]
                    ">

                      <span className="text-sm font-medium">
                        👥 4 Members
                      </span>

                      <span className="text-xl">
                        ⋮
                      </span>

                    </div>

                  </div>

                  {/* MEMBERS */}

                  <div className="
                  grid
                  grid-cols-4
                  gap-4
                  mt-5
                  ">

                    {

                      team.members.map((member) => (

                        <div
                          key={member.name}
                          className="
                          border
                          border-[#ebe7f2]
                          rounded-[22px]
                          p-5
                          hover:shadow-md
                          transition
                          "
                        >

                          <div className="
                          w-16
                          h-16
                          rounded-full
                          bg-[#f3e8ff]
                          flex
                          items-center
                          justify-center
                          text-[30px]
                          ">

                            👤

                          </div>

                          <h3 className="
                          mt-5
                          text-[18px]
                          font-bold
                          leading-5
                          ">

                            {member.name}

                          </h3>

                          <p className="
                          text-[#667085]
                          text-sm
                          mt-2
                          ">

                            {member.role}

                          </p>

                          {/* TAGS */}

                          <div className="
                          flex
                          flex-wrap
                          gap-2
                          mt-4
                          ">

                            {

                              member.skills.map((skill) => (

                                <span
                                  key={skill}
                                  className="
                                  bg-[#f3e8ff]
                                  text-[#7c3aed]
                                  text-[11px]
                                  px-3
                                  py-1
                                  rounded-full
                                  font-semibold
                                  "
                                >

                                  {skill}

                                </span>

                              ))

                            }

                          </div>

                        </div>

                      ))

                    }

                  </div>

                  {/* RATIONALE */}

                  {

                    team.id === 2 && (

                      <div className="
                      mt-5
                      bg-[#eefcf0]
                      border
                      border-[#d7f2db]
                      rounded-[22px]
                      p-5
                      flex
                      justify-between
                      items-center
                      ">

                        <div>

                          <h3 className="
                          text-[#16a34a]
                          font-bold
                          ">

                            ✨ Rationale

                          </h3>

                          <p className="
                          mt-2
                          text-[#667085]
                          max-w-[760px]
                          leading-7
                          text-sm
                          ">

                            This team has a strong balance of full stack, data and DevOps skills. The combination of Karan's development expertise and Priya's data skills will help in building data-driven, scalable solutions.

                          </p>

                        </div>

                        <button className="
                        text-[#7c3aed]
                        font-semibold
                        text-sm
                        ">

                          View Details ˅

                        </button>

                      </div>

                    )

                  }

                </div>

              ))

            }

          </div>

        </div>

        {/* RIGHT */}

        <div className="
        col-span-3
        space-y-5
        ">

          {/* SUMMARY */}

          <div className="
          bg-white
          border
          border-[#ebe7f2]
          rounded-[28px]
          p-7
          shadow-[0_2px_12px_rgba(0,0,0,0.03)]
          ">

            <h2 className="
            text-[34px]
            font-bold
            tracking-[-1px]
            ">

              Formation Summary

            </h2>

            <div className="
            mt-8
            space-y-7
            ">

              <div className="flex justify-between">

                <span className="text-[#667085]">
                  👥 Total Participants
                </span>

                <span className="font-bold">
                  24
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[#667085]">
                  🧩 Teams Generated
                </span>

                <span className="font-bold">
                  6
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[#667085]">
                  👨‍💻 Members per Team
                </span>

                <span className="font-bold">
                  4
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[#667085]">
                  ✨ Method Used
                </span>

                <span className="font-bold">
                  Random
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[#667085]">
                  🕒 Generated On
                </span>

                <span className="font-bold text-right">
                  May 18, 2025,
                  12:30 PM
                </span>

              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="
          bg-white
          border
          border-[#ebe7f2]
          rounded-[28px]
          p-7
          shadow-[0_2px_12px_rgba(0,0,0,0.03)]
          ">

            <h2 className="
            text-[34px]
            font-bold
            tracking-[-1px]
            mb-6
            ">

              Actions

            </h2>

            <div className="space-y-4">

              <button className="
              w-full
              border
              border-[#ebe7f2]
              rounded-2xl
              p-4
              font-medium
              hover:bg-gray-50
              ">

                ⬇ Download Teams

              </button>

              <button className="
              w-full
              bg-[#dcfce7]
              text-[#16a34a]
              rounded-2xl
              p-4
              font-medium
              ">

                ✓ Approve Teams

              </button>

              <button className="
              w-full
              border
              border-[#fecaca]
              text-[#ef4444]
              rounded-2xl
              p-4
              font-medium
              ">

                🗑 Clear All Teams

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}