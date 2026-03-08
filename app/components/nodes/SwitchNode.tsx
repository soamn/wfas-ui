"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import { useFlowStore } from "@/app/store/node/node.store";
import { Position } from "@xyflow/react";
import CustomHandle from "./ui/customHandle";
import BaseNode from "./BaseNode";
import { PiTerminalWindowFill } from "react-icons/pi";
import { ICON_MAP } from "@/app/store/node/node.icons";

const SwitchNode = ({
  id,
  data,
  selected,
}: { id: string; selected?: boolean } & NodeDataProps<NodeKind.SWITCH>) => {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const cases = config?.cases || [];
  const referencePath = config?.referencePath || "";
  const showDefault = config?.showDefault !== false;
  const Icon = ICON_MAP[NodeKind.SWITCH];
  return (
    <BaseNode id={id} hasInput={false} hasOutput={false}  status={data.status}>
      <div
        className={`node-base ${selected ? "node-selected" : "node-default"} w-60 overflow-visible `}
      >
        <CustomHandle
          type="target"
          id="in_data"
          position={Position.Left}
          show={selected || true}
        />

        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-1 bg-orange-500/10 rounded-lg">
            <Icon className="text-orange-500 size-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {data.label || "Switch"}
          </span>
        </div>

        <div className="px-3 py-2 bg-zinc-500/3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          <PiTerminalWindowFill className="text-zinc-400 shrink-0" size={12} />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] uppercase font-black text-zinc-400 leading-none mb-0.5">
              Ref Path
            </span>
            <span className="text-[10px] font-mono truncate text-orange-600 dark:text-orange-400 font-bold">
              {referencePath || "Not Assigned"}
            </span>
          </div>
        </div>

        <div className="p-1.5 space-y-1">
          {cases.map((c: any, index: number) => (
            <div
              key={c.id}
              className="relative flex items-center justify-between px-2.5 py-2 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group transition-all"
            >
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-[8px] uppercase text-orange-500/60 font-black leading-none">
                  Path {index + 1}
                </span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-bold truncate">
                  <span className="text-zinc-400 font-normal mr-1">
                    {c.condition}
                  </span>
                  {c.value || "—"}
                </span>
              </div>

              <CustomHandle
                className="absolute! -right-1.5! border-orange-500! bg-white! dark:bg-zinc-900!"
                type="source"
                id={c.id}
                position={Position.Right}
                show={true}
              />
            </div>
          ))}

          {showDefault && (
            <div className="relative flex items-center justify-between px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 mt-2">
              <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">
                Default Case
              </span>
              <CustomHandle
                className="absolute! -right-1.5! border-zinc-400! bg-white! dark:bg-zinc-900!"
                type="source"
                id="out_default"
                position={Position.Right}
                show={true}
              />
            </div>
          )}

          {cases.length === 0 && (
            <div className="py-6 text-center border-2 border-dashed border-zinc-50 dark:border-zinc-900 rounded-xl">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">
                Waiting for logic...
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default SwitchNode;
