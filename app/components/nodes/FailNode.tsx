"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { useFlowStore } from "@/app/store/node/node.store";
import { PiWarningOctagonFill, PiXBold } from "react-icons/pi";
import { ICON_MAP } from "@/app/store/node/node.icons";

export default function FailNode({
  id,
  data,
  selected,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.FAIL>) {
  const Icon = ICON_MAP[NodeKind.FAIL];
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const errorMessage = config?.errorMessage || "Execution terminated.";

  return (
    <BaseNode id={id} status={data.status} hasOutput={false}>
      <div
        className={`node-base rounded-xl w-24 h-24 flex flex-col items-center justify-center transition-all duration-200 ${
          selected ? "node-error" : "node-default"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1 group">
          <Icon className="w-10 h-10 transition-all text-red-600 dark:text-red-500 duration-200 group-hover:scale-90 active:scale-75" />

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">
              Terminate
            </span>
            <small className="text-[7px] text-zinc-500 uppercase font-bold tracking-widest">
              Error
            </small>
          </div>
        </div>

        {selected && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white text-[8px] px-2 py-0.5 rounded shadow-lg animate-in fade-in zoom-in">
            {errorMessage}
          </div>
        )}
      </div>
    </BaseNode>
  );
}
