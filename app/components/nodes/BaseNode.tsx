"use client";
import { Position, useNodeConnections, useConnection } from "@xyflow/react";
import { useState } from "react";
import CustomHandle from "./ui/customHandle";
import { ErrorBadge } from "./ui/ErrorBadge";

type Side = "top" | "left" | "right" | "bottom" | null;
interface BaseNodeProps {
  id: string;
  children: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
  status?: string;
}
export default function BaseNode({
  id,
  children,
  hasInput = true,
  hasOutput = true,
  status = "idle",
}: BaseNodeProps) {
  const [activeSide, setActiveSide] = useState<Side>(null);
  const { inProgress: isConnecting } = useConnection();
  const connections = useNodeConnections({ id });

  const isHandleConnected = (handleId: string) =>
    connections.some(
      (c) => c.sourceHandle === handleId || c.targetHandle === handleId,
    );

  const handleSpecs = [
    {
      id: "in_left",
      pos: Position.Left,
      type: "target" as const,
      side: "left" as const,
      enabled: hasInput,
    },
    {
      id: "in_top",
      pos: Position.Top,
      type: "target" as const,
      side: "top" as const,
      enabled: hasInput,
    },
    {
      id: "out_right",
      pos: Position.Right,
      type: "source" as const,
      side: "right" as const,
      enabled: hasOutput,
    },
    {
      id: "out_bottom",
      pos: Position.Bottom,
      type: "source" as const,
      side: "bottom" as const,
      enabled: hasOutput,
    },
  ];

  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse";
      case "success":
        return "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case "failed":
        return "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
      default:
        return "border-zinc-200 dark:border-zinc-800";
    }
  };

  return (
    <div
      key={id}
      className={`relative inline-block border rounded-2xl transition-all duration-500 ${getStatusStyles()}`}
      onMouseLeave={() => setActiveSide(null)}
    >
      <div className="relative z-10">
        {children}

        <ErrorBadge id={id} />
      </div>
      {handleSpecs
        .filter((h) => h.enabled)
        .map((h) => (
          <div key={h.id}>
            <div
              onMouseEnter={() => setActiveSide(h.side)}
              className={`absolute z-20 ${
                h.side === "top" || h.side === "bottom"
                  ? "inset-x-0 h-4"
                  : "inset-y-0 w-4"
              } ${
                h.side === "top"
                  ? "-top-2"
                  : h.side === "bottom"
                    ? "-bottom-2"
                    : h.side === "left"
                      ? "-left-2"
                      : "-right-2"
              }`}
            />

            <CustomHandle
              id={h.id}
              type={h.type}
              position={h.pos}
              show={
                activeSide === h.side || isHandleConnected(h.id) || isConnecting
              }
            />
          </div>
        ))}
    </div>
  );
}
