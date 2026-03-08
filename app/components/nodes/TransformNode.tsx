"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { HiArrowRight } from "react-icons/hi2";
import { ICON_MAP } from "@/app/store/node/node.icons";

export default function TransformNode({
  id,
  data,
  selected,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.TRANSFORM>) {
  const Icon = ICON_MAP[NodeKind.TRANSFORM];
  const { config } = data;

  const transforms = config?.transforms || [];
  const transformCount = transforms.length;
  const isConfigured = transformCount > 0;
  const isRunning = data?.status === "running";

  return (
    <BaseNode id={id}  status={data.status}>
      <div
        className={`node-base w-48 min-h-20 relative transition-all 
          duration-200 
          ${selected ? "node-selected" : "node-default"}
          ${isRunning ? "node-running" : ""}
        `}
      >
        <div className="flex items-center justify-between px-3 py-2  bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-700">
          <div className="flex items-center gap-2 ">
            <Icon className="text-pink-500 size-3.5" />
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {data.label || "Transform"}
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold">
            MAP
          </span>
        </div>

        {/* Transformation List Preview */}
        <div className="p-3 flex flex-col gap-1.5">
          {isConfigured ? (
            <div className="flex flex-col gap-1">
              {/* Show the first transform mapping */}
              <div className="flex items-center justify-between gap-1 bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-md border border-zinc-100 dark:border-zinc-700/50">
                <span className="text-[9px] font-mono text-zinc-400 truncate max-w-15">
                  {transforms[0].originalPath || "root"}
                </span>
                <HiArrowRight className="size-2 text-pink-400 shrink-0" />
                <span className="text-[9px] font-mono font-bold text-zinc-700 dark:text-zinc-200 truncate max-w-[60px]">
                  {transforms[0].changedKey}
                </span>
              </div>

              {transformCount > 1 && (
                <div className="text-center">
                  <span className="text-[9px] font-bold text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full">
                    +{transformCount - 1} more mappings
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 opacity-50">
              <span className="text-[10px] text-zinc-400 italic">
                No transforms set
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
