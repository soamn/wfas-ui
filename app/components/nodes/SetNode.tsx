"use client";
import BaseNode from "./BaseNode";
import { NodeKind } from "@/app/store/node/node.constants";
import { ICON_MAP } from "@/app/store/node/node.icons";
import { NodeDataProps } from "@/app/store/node/node.schema";

const SetNode = ({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.SET>) => {
  const Icon = ICON_MAP[NodeKind.SET];
  const { config } = data;

  const fields = config?.fields || [];
  const fieldCount = fields.length;
  const isValid = fieldCount > 0;

  const isRunning = data?.status === "running";
  // Aligned with standard error status
  const isError = data?.status === "failed";

  return (
    <BaseNode id={id}  status={data.status}>
      <div
        className={`node-base w-45 min-h-24 relative transition-all duration-200 rounded-2xl
          ${selected ? "node-selected" : "node-default"}
          ${!isValid && selected ? "border-amber-200  " : ""}
          ${isError && selected ? "node-error" : ""}
          ${isRunning ? "node-running" : ""}
        `}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-300 dark:border-zinc-800">
          <Icon className="text-amber-500 size-3.5" />
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {data.label}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-3 gap-1">
          {fieldCount > 0 ? (
            <div className="flex flex-col items-center gap-1.5">
              <code className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-zinc-600 dark:text-zinc-300 border border-zinc-200/50">
                {fields[0]?.key || "variable"}
              </code>

              {fieldCount > 1 && (
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-800/50">
                  +{fieldCount - 1} more
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 opacity-60">
              <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70 italic font-medium">
                No variables defined
              </span>
            </div>
          )}
        </div>
        {/* Execution Indicator */}
        {isRunning && (
          <div className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default SetNode;
