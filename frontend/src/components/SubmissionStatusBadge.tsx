import React from "react";

interface Props {
  status: string;
}

export default function SubmissionStatusBadge({ status }: Props) {
  let bgColor = "bg-gray-100 text-gray-700";
  let label = "Draft";

  if (status === "IN_PROGRESS") {
    bgColor = "bg-blue-100 text-blue-700";
    label = "In Progress";
  } else if (status === "READY") {
    bgColor = "bg-orange-100 text-orange-700";
    label = "Ready";
  } else if (status === "SUBMITTED") {
    bgColor = "bg-green-100 text-green-700";
    label = "Submitted";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${bgColor}`}>
      {label}
    </span>
  );
}