"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { useFlowStore } from "@/app/store/node/node.store";
import { FiAlertCircle, FiCheck } from "react-icons/fi";
import { ICON_MAP } from "@/app/store/node/node.icons";

export default function ExtractNode({
  id,
  data,
  selected,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.EXTRACT>) {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const Icon = ICON_MAP[NodeKind.EXTRACT];
  const extractedPaths = config?.extractedPaths || [];
  const isEmpty = extractedPaths.length === 0;

  return (
    <BaseNode id={id} status={data.status}>
      <div
        className={`node-base w-45 min-h-24 relative transition-all duration-200 
          overflow-visible
          ${selected ? "node-selected" : "node-default"}
        `}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Icon
              className={`${isEmpty ? "text-red-500" : "text-emerald-500"} size-3.5`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${isEmpty ? "text-red-600 dark:text-red-400" : "text-zinc-500"}`}
            >
              Extract
            </span>
          </div>
          {isEmpty ? (
            <FiAlertCircle className="text-red-400 size-3 animate-pulse" />
          ) : (
            <FiCheck className="text-emerald-500 size-3" />
          )}
        </div>

        {/* Content Section */}
        <div className="p-3">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-2 opacity-60">
              <span className="text-[10px] text-red-400 italic font-medium">
                No fields selected
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tighter">
                <span className="text-zinc-400">Fields</span>
                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 rounded-full">
                  {extractedPaths.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {extractedPaths.slice(0, 3).map((path: string) => (
                  <div
                    key={path}
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[8px] px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-mono"
                  >
                    {path.split(".").pop()}
                  </div>
                ))}
                {extractedPaths.length > 3 && (
                  <span className="text-[8px] text-zinc-400 font-medium pl-1">
                    +{extractedPaths.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
