"use client";

import BaseNode from "./BaseNode";
import { ProviderMetadata } from "@/app/store/credential/credential.registry";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { WebhookConfigSchema } from "@/app/store/node/node.schema";
import { PiGlobeBold, PiWarningCircleFill } from "react-icons/pi";

export default function WebHookNode({ id, selected, data }: any) {
  const providerKey = data.config?.provider as ProviderEnum;
  const providerInfo = providerKey ? ProviderMetadata[providerKey] : null;
  const Icon = providerInfo?.icon || PiGlobeBold;
  const isValid = WebhookConfigSchema.safeParse(data.config).success;

  return (
    <BaseNode id={id} hasInput={false} status={data.status}>
      <div
        className={`
    node-base relative w-45 rounded-2xl transition-all duration-200
    ${selected ? (!isValid ? "border-red-500/30! " : "node-selected") : "node-default"}
  `}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Icon
              size={14}
              style={{ color: providerInfo ? providerInfo.color : "#71717a" }}
            />
            <span className="text-[10px] font-bold dark:text-white uppercase tracking-wider">
              {providerInfo ? providerKey : "Webhook"}
            </span>
          </div>
          {providerInfo && (
            <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        <div className="p-3">
          {providerKey ? (
            <div className="space-y-1">
              <div className="text-[8px] uppercase text-zinc-400 font-bold leading-none">
                Active
              </div>
              <div className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {data.config.triggerMessage || (
                  <span className="italic text-zinc-400">
                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1">
              <PiWarningCircleFill className="text-amber-500 size-3" />
              <span className="text-[9px] font-medium text-zinc-400 italic">
                No provider selected
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
