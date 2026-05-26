import { useState } from "react";

import { ApprovalRequest } from "../../types";

import { Button } from "../ui/button";

import StatusBadge from "./StatusBadge";

interface ApprovalCardProps {

  approval: ApprovalRequest;

  onApprove: (id: string, notes?: string) => Promise<void>;

  onReject: (id: string, notes: string) => Promise<void>;

}

const TYPE_LABELS: Record<string, string> = {

  team_formation:          "Team Formation",

  communication_send:      "Send Communication",

  results_publish:         "Publish Results",

  progression_invitations: "Progression Invitations",

  anomaly_resolution:      "Anomaly Resolution",

};

export default function ApprovalCard({ approval, onApprove, onReject }: ApprovalCardProps) {

  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);

  async function handle(action: "approve" | "reject") {

    if (action === "reject" && !notes.trim()) {

      alert("Please provide a reason for rejection.");

      return;

    }

    setBusy(true);

    try {

      if (action === "approve") await onApprove(approval.id, notes || undefined);

      else await onReject(approval.id, notes);

    } finally {

      setBusy(false);

    }

  }

  return (

    <div className="bg-white rounded-xl border border-gray-200 p-5">

      <div className="flex items-start justify-between mb-3">

        <div>

          <p className="font-medium text-gray-800">{TYPE_LABELS[approval.type] ?? approval.type}</p>

          <p className="text-xs text-gray-400 mt-0.5">

            Requested {new Date(approval.created_at).toLocaleString()}

          </p>

        </div>

        <StatusBadge status={approval.status} />

      </div>

      {approval.payload && (

        <pre className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 overflow-auto max-h-36 mb-4">

          {JSON.stringify(approval.payload, null, 2)}

        </pre>

      )}

      {approval.status === "pending" && (

        <>

          <textarea

            placeholder="Notes / reason (required for rejection)"

            value={notes}

            onChange={(e) => setNotes(e.target.value)}

            rows={2}

            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none

              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 mb-3 resize-none"

          />

          <div className="flex gap-2">

            <Button size="sm" onClick={() => handle("approve")} disabled={busy}>

              Approve

            </Button>

            <Button size="sm" variant="destructive" onClick={() => handle("reject")} disabled={busy}>

              Reject

            </Button>

          </div>

        </>

      )}

      {approval.status !== "pending" && approval.notes && (

        <p className="text-sm text-gray-600 mt-1">

          <span className="font-medium">Notes:</span> {approval.notes}

        </p>

      )}

    </div>

  );

}
