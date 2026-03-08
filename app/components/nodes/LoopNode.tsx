"use client";
import { Handle, Position } from "@xyflow/react";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { useFlowStore } from "@/app/store/node/node.store";
import { ICON_MAP } from "@/app/store/node/node.icons";

export default function LoopNode({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.LOOP>) {
  const Icon = ICON_MAP[NodeKind.LOOP];
  const config = useFlowStore((state) => state.getNodeConfig(id));

  return (
    <BaseNode id={id} hasOutput={false} status={data.status}>
      <div
        className={`node-base w-52 min-h-24 relative transition-all duration-200 ${
          selected ? "node-selected" : "node-default"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800/50">
          <div className="flex items-center gap-2">
            <Icon className="text-orange-600 size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 dark:text-orange-400">
              Loop Iterator
            </span>
          </div>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">
              Collection
            </span>
            <code className="text-[10px] px-2 py-1 bg-orange-100/30 dark:bg-orange-900/40 rounded border border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300 truncate font-mono">
              {config?.loopOver || "Select Source..."}
            </code>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-orange-600 uppercase">
                Run Per Item
              </span>
              <span className="text-[10px] text-orange-400">&rarr;</span>
            </div>
            <div className="flex flex-col items-center mt-2 border-t border-zinc-50 dark:border-zinc-800/50 pt-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">
                On Complete
              </span>
              <span className="text-[10px] text-zinc-400">&darr;</span>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="iterate"
        style={{
          top: "68%",
          transition: "opacity 200ms, border-color 150ms",
        }}
        className="w-2! h-2! bg-orange-500! border-white! z-50"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="next"
        style={{
          left: "50%",
          transition: "opacity 200ms, border-color 150ms",
        }}
        className="w-2! h-2! bg-zinc-700! border-white! z-50"
      />
    </BaseNode>
  );
}
