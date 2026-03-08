"use client";
import {
  DelayConfigSchema,
  NodeDataProps,
} from "@/app/store/node/node.schema";
import BaseNode from "./BaseNode";
import { NodeKind } from "@/app/store/node/node.constants";
import { ICON_MAP } from "@/app/store/node/node.icons";

const DelayNode = ({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.DELAY>) => {
  const Icon = ICON_MAP[NodeKind.DELAY];
  const { config } = data;
  const validation = DelayConfigSchema.safeParse(config);
  const isValid = validation.success;

  const getFormattedTime = () => {
    const parts = [];
    if (config.hours > 0) parts.push(`${config.hours}h`);
    if (config.minutes > 0) parts.push(`${config.minutes}m`);
    if (config.seconds > 0) parts.push(`${config.seconds}s`);
    if (config.milliseconds > 0) parts.push(`${config.milliseconds}ms`);

    return parts.length > 0 ? parts.join(" ") : "Not set";
  };

  return (
    <BaseNode id={id} status={data.status}>
      <div
        className={`node-base ${selected ? "node-selected" : "node-default"}
        w-30  p-2  flex flex-col items-center justify-center transition-all
         ${!isValid && "node-error "}
           group overflow-visible
         `}
      >
        {!isValid && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-[10px] text-white font-bold">!</span>
          </div>
        )}

        <div className="bg-amber-50 p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4 text-amber-600" />
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold  uppercase tracking-tighter">
            Delay
          </p>
          <p
            className={`text-xs font-mono w-20 truncate  font-medium ${isValid ? "" : "text-red-600"}`}
          >
            {getFormattedTime()}
          </p>
        </div>

        {data?.status === "running" && (
          <div className="mt-2 w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-1/2 animate-pulse" />
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default DelayNode;
