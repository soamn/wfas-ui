"use client";
import { NodeDataProps } from "@/app/store/node/node.schema";
import { NodeKind } from "@/app/store/node/node.constants";
import BaseNode from "./BaseNode";
import { SlGlobe } from "react-icons/sl";
import { useTheme } from "@/app/provider/theme-provider";
import { ICON_MAP } from "@/app/store/node/node.icons";
import { ProviderMetadata } from "@/app/store/credential/credential.registry";
import { useAuthStore } from "@/app/store/auth/auth.store";

export default function ActionNode({
  id,
  selected,
  data,
  
}: { id: string; selected?: boolean } & NodeDataProps<NodeKind.ACTION>) {
  const Icon = ICON_MAP[NodeKind.ACTION];
  const { config } = data;
  const { theme } = useTheme();
  const providerKey = config.provider as keyof typeof ProviderMetadata;
  const SelectedProvider = providerKey ? ProviderMetadata[providerKey] : null;
  const ProviderIcon = SelectedProvider?.icon || SlGlobe;
  const { user } = useAuthStore();
  const isValid = user?.credentials.find((cred) => cred.name === providerKey);

  return (
    <BaseNode id={id} status={data.status}>
      <div
        className={`
    node-base relative w-45 rounded-2xl transition-all duration-200
    ${selected ? (!isValid ? "border-red-500/30! " : "node-selected") : "node-default"}
  `}
      >
        <div
          className="flex items-center justify-between px-3 py-2 border-b
         dark:border-zinc-500 border-zinc-200 "
        >
          <div className="flex items-center gap-2">
            <Icon className="text-blue-500 size-3.5" />
            <span className="text-[10px] font-bold  uppercase tracking-wider">
              {data.label || "Action"}
            </span>
          </div>
          {SelectedProvider && (
            <div
              className="flex items-center justify-center rounded-md p-1"
              style={{
                backgroundColor: theme === "dark" ? "white" : "",
              }}
            >
              <ProviderIcon
                className="size-3"
                style={{
                  color: SelectedProvider.color || "#71717a",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-3 gap-1">
          {config.provider ? (
            <>
              <span className="text-[9px] font-bold text-zinc-400 leading-none">
                Provider
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-700 dark:text-white capitalize">
                  {config.provider}
                </span>
              </div>
            </>
          ) : (
            <span className="text-[11px] font-medium text-zinc-400 italic">
              Standard Execution
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
