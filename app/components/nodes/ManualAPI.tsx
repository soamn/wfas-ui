"use client";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import {
  ManualApiConfigSchema,
  NodeDataProps,
} from "@/app/store/node/node.schema";
import { ICON_MAP } from "@/app/store/node/node.icons";

const ManualAPINode = ({
  id,
  selected,
  data,
}: { id: string; selected: boolean } & NodeDataProps<NodeKind.MANUAL_API>) => {
  const Icon = ICON_MAP[NodeKind.MANUAL_API];
  const { config } = data;
  const isValid = ManualApiConfigSchema.safeParse(config).success;

  return (
    <BaseNode id={id}  status={data.status}>
      <div
        className={`
    node-base relative w-45 rounded-2xl transition-all duration-200
    ${selected ? (!isValid ? "border-red-500/30! " : "node-selected") : "node-default"}
  `}
      >
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-inherit rounded-t-2xl">
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              config.method === "POST"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {config.method}
          </span>
          <small className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">
            {data.label}
          </small>
          <Icon
            className={`w-3.5 h-3.5 ${isValid ? "text-zinc-400" : "text-red-400"}`}
          />
        </div>

        <div className="p-4 flex flex-col items-center text-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-full mt-1">
              {config.apiEndpoint ? (
                <p className="text-[10px] font-mono truncate w-full px-2 text-zinc-600">
                  {config.apiEndpoint}
                </p>
              ) : (
                <p className="text-[10px] italic text-red-400">
                  Endpoint not configured
                </p>
              )}
            </div>
          </div>
        </div>

        {data?.status !== "idle" && (
          <div className="px-3 pb-2 w-full">
            <div
              className={`h-1 w-full rounded-full overflow-hidden bg-zinc-100`}
            >
              <div
                className={`h-full transition-all duration-500 ${
                  data.status === "running"
                    ? "bg-blue-500 animate-pulse w-full"
                    : data.status === "success"
                      ? "bg-green-500 w-full"
                      : "bg-red-500 w-full"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default ManualAPINode;
