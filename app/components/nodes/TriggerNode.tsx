import BaseNode from "./BaseNode";
import { NodeKind } from "@/app/store/node/node.constants";
import { ICON_MAP } from "@/app/store/node/node.icons";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { MdAccessTime } from "react-icons/md";

export default function TriggerNode({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.TRIGGER>) {
  const Icon = ICON_MAP[NodeKind.TRIGGER];
  return (
    <BaseNode id={id} hasInput={false} hasOutput={true}  status={data.status}>
      <button
        className={`node-base ${selected ? "node-selected" : "node-default"} rounded-xl w-20! h-20! flex flex-col items-center justify-center `}
      >
        <Icon className="w-10 h-10 hover:w-8 hover:h-8 transition-all text-zinc-800 dark:text-zinc-200 duration-200 active:w-5 active:h-5" />
        <small className="text-[8px] ">Trigger Node</small>
      </button>
    </BaseNode>
  );
}
