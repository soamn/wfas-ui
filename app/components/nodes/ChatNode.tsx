"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { ICON_MAP } from "@/app/store/node/node.icons";
import { PiWarningCircleFill } from "react-icons/pi";

export default function ChatNode({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.CHAT>) {
  const Icon = ICON_MAP[NodeKind.CHAT];

  const selectedModel = data.config?.model;

  const displayModel = selectedModel
    ? selectedModel.split("/").pop()?.toUpperCase()
    : null;

  return (
    <BaseNode id={id} status={data.status}>
      <div
        className={`node-base min-w-40 ${selected ? "node-selected" : "node-default"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
          <Icon className="text-indigo-600 size-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-tight dark:text-zinc-300">
            OpenRouter AI
          </span>
        </div>

        {/* Model Display Area */}
        <div className="p-3">
          {displayModel ? (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-lg">
              <div className="size-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                {displayModel}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
              <PiWarningCircleFill className="text-zinc-400 size-3" />
              <span className="text-[9px] font-medium text-zinc-400 italic">
                Model not selected
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
