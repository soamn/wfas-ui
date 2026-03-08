"use client";
import { Handle, Position } from "@xyflow/react";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { ICON_MAP } from "@/app/store/node/node.icons";

const FilterNode = ({
  id,
  data,
  selected,
}: { id: string; selected: true } & NodeDataProps<NodeKind.FILTER>) => {
  const { config } = data;
  const Icon = ICON_MAP[NodeKind.FILTER];
  return (
    <BaseNode id={id} hasInput={false} hasOutput={false} status={data.status}>
      <div
        className={`node-base ${selected ? "node-selected" : "node-default"} 
      relative   rounded-2xl   
       transition-all overflow-visible
      `}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="in_left"
          className="w-2! h-2! border-emerald-500! bg-white! border-2"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="out_right"
          isConnectable={true}
          className="w-2! h-2! bg-sky-500! border-2 border-blue-500!"
        />{" "}
        <div className="p-4 flex flex-col items-center gap-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>

          <div className="text-center">
            <p className="text-[10px] font-bold  uppercase tracking-widest">
              Filter
            </p>
            <p className="text-[10px] font-medium  truncate max-w-35">
              {config?.fieldName
                ? `${config.fieldName} ${config.operator} ${config.compareValue}`
                : "Click to configure"}
            </p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default FilterNode;
