"use client";

import { NodeDataProps } from "@/app/store/node/node.schema";

import { NodeKind } from "@/app/store/node/node.constants";

import { Position } from "@xyflow/react";

import CustomHandle from "./ui/customHandle";

import BaseNode from "./BaseNode";

import { ICON_MAP } from "@/app/store/node/node.icons";

const ConditionNode = ({
  id,
  data,

  selected,
}: { id: string; selected?: boolean } & NodeDataProps<NodeKind.CONDITION>) => {
  const Icon = ICON_MAP[NodeKind.CONDITION];

  return (
    <BaseNode id={id} hasInput={false} hasOutput={false} status={data.status}>
      <div
        className={`node-base ${selected ? "node-selected" : "node-default"} overflow-visible`}
      >
        <CustomHandle
          type="target"
          id="in_data"
          position={Position.Left}
          show={selected || true}
          className="w-2.5! h-2.5! border-zinc-400! dark:border-zinc-600! bg-white! dark:bg-zinc-900!"
        />

        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
          <Icon className="text-indigo-500 size-4" />

          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {data.label || "Branch"}
          </span>
        </div>

        <div className="p-1.5 space-y-1">
          <div className="relative group/true flex items-center justify-between px-2 py-1.5 rounded-xl transition-colors hover:bg-emerald-500/3">
            <span className="text-[9px] font-bold uppercase tracking-tight text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 w-full rounded-lg px-2 py-1.5 border border-emerald-500/10">
              If True
            </span>

            <CustomHandle
              className="absolute! -right-1.5! border-emerald-500! bg-white! dark:bg-zinc-900! shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              type="source"
              id="out_true"
              position={Position.Right}
              show={selected || true}
            />
          </div>

          <div className="relative group/false flex items-center justify-between px-2 py-1.5 rounded-xl transition-colors hover:bg-rose-500/3">
            <span className="text-[9px] font-bold uppercase tracking-tight text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 w-full rounded-lg px-2 py-1.5 border border-rose-500/10">
              If False
            </span>

            <CustomHandle
              className="absolute! -right-1.5! border-rose-500! bg-white! dark:bg-zinc-900! shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              type="source"
              id="out_false"
              position={Position.Right}
              show={selected || true}
            />
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default ConditionNode;
