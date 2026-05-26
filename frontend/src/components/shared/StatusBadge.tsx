type Variant = "success" | "warning" | "error" | "info" | "neutral";

const STATUS_MAP: Record<string, Variant> = {

  completed:              "success",

  approved:               "success",

  sent:                   "success",

  delivered:              "success",

  resolved:               "success",

  evaluated:              "success",

  active:                 "info",

  team_formation:         "info",

  challenge_assigned:     "info",

  evaluation:             "info",

  pending:                "warning",

  pending_approval:       "warning",

  score_consolidation:    "warning",

  rejected:               "error",

  failed:                 "error",

  draft:                  "neutral",

  queued:                 "neutral",

  dismissed:              "neutral",

  intake:                 "neutral",

};

const CLASSES: Record<Variant, string> = {

  success: "bg-green-100 text-green-700",

  warning: "bg-amber-100 text-amber-700",

  error:   "bg-red-100 text-red-700",

  info:    "bg-indigo-100 text-indigo-700",

  neutral: "bg-gray-100 text-gray-600",

};

interface StatusBadgeProps {

  status: string;

  className?: string;

}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {

  const variant = STATUS_MAP[status] ?? "neutral";

  return (

    <span

      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium

        ${CLASSES[variant]} ${className}`}

    >

      {status.replace(/_/g, " ")}

    </span>

  );

}
