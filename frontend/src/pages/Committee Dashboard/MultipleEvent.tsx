type Event = {
  id: number;
  name: string;
  logo: string;
  selected: boolean;
};

export default function MultipleEvent(): JSX.Element {
  const events: Event[] = [
  {
    id: 1,
    name: "Microsoft Event",
    logo: "/Microsoft.png",
    selected: false,
  },
  {
    id: 2,
    name: "Google Hackathon",
    logo: "/Google.png",
    selected: true,
  },
  {
    id: 3,
    name: "Amazon Hackathon",
    logo: "/Amazon.png",
    selected: false,
  },
];

  const stages: string[] = [
    "intake",
    "team formation",
    "challenge assigned",
    "evaluation",
    "score consolidation",
    "completed",
  ];

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Overview
      </h1>

      {/* Create Event */}
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
            +
          </div>

          <h2 className="font-semibold text-lg">
            Create New Event
          </h2>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Hackathon name"
            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition">
            Create
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-5">
        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-2xl border p-6 flex items-center justify-between shadow-sm ${
              event.selected
                ? "border-violet-300"
                : "border-gray-200"
            }`}
          >
            <div className="flex gap-5">
              {/* Logo */}
              <div className="w-14 h-14 bg-gray-50 border rounded-xl flex items-center justify-center">
                <img
                  src={event.logo}
                  alt={event.name}
                  className="w-9 h-9 object-contain"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-xl text-gray-900">
                  {event.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Stage: Intake
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {stages.map((stage, index) => (
                    <span
                      key={stage}
                      className={`text-xs px-3 py-1 rounded-md ${
                        index === 0
                          ? "bg-violet-100 text-violet-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className={`px-5 py-2 rounded-xl font-medium transition ${
                event.selected
                  ? "border border-violet-500 text-violet-600 bg-white"
                  : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {event.selected ? "Selected ✓" : "Select →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}