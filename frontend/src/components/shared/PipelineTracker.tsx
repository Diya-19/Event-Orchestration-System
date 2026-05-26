import { PipelineStage } from "../../types";

interface PipelineTrackerProps {

  stages: PipelineStage[];

}

const DOT: Record<string, string> = {

  completed: "bg-green-500",

  active:    "bg-indigo-500 ring-4 ring-indigo-100",

  pending:   "bg-gray-300",

};

const LINE: Record<string, string> = {

  completed: "bg-green-400",

  active:    "bg-indigo-200",

  pending:   "bg-gray-200",

};

const LABEL: Record<string, string> = {

  completed: "text-green-700",

  active:    "text-indigo-700 font-semibold",

  pending:   "text-gray-400",

};

export default function PipelineTracker({ stages }: PipelineTrackerProps) {

  return (

    <div className="bg-white rounded-xl border border-gray-200 px-6 py-5 mb-6">

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Pipeline</p>

      <div className="flex items-start">

        {stages.map((s, i) => (

          <div key={s.stage} className="flex items-center flex-1 last:flex-none">

            {/* Node */}

            <div className="flex flex-col items-center">

              <div className={`w-3 h-3 rounded-full shrink-0 ${DOT[s.status] ?? "bg-gray-300"}`} />

              <span

                className={`mt-2 text-xs text-center leading-tight max-w-[72px]

                  ${LABEL[s.status] ?? "text-gray-400"}`}

              >

                {s.stage.replace(/_/g, " ")}

              </span>

            </div>

            {/* Connector */}

            {i < stages.length - 1 && (

              <div className={`flex-1 h-0.5 mx-1 -mt-3.5 ${LINE[s.status] ?? "bg-gray-200"}`} />

            )}

          </div>

        ))}

      </div>

    </div>

  );

}
