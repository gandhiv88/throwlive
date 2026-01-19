import React from "react";

export type MatchStatus = "live" | "final" | "scheduled" | "pending" | string;

export default function StatusBadge({ status }: { status: MatchStatus }) {
  let label = "";
  let className =
    "inline-block px-2 py-0.5 rounded text-xs font-bold transition-colors duration-300 ";
  switch (status) {
    case "live":
      label = "LIVE";
      className += "bg-green-900 text-green-200 animate-pulse";
      break;
    case "final":
      label = "FINAL";
      className += "bg-gray-800 text-gray-200";
      break;
    case "scheduled":
      label = "SCHEDULED";
      className += "bg-blue-900 text-blue-200";
      break;
    case "pending":
      label = "PENDING";
      className += "bg-yellow-900 text-yellow-200";
      break;
    default:
      label = String(status).toUpperCase();
      className += "bg-gray-700 text-gray-200";
  }
  return <span className={className}>{label}</span>;
}
