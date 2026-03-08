"use client";

import { useFlowStore } from "@/app/store/node/node.store";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { WebhookConfigSchema } from "@/app/store/node/node.schema";
import { ProviderMetadata } from "@/app/store/credential/credential.registry";
import { useCallback } from "react";

export default function WebhookMenu({ id }: { id: string }) {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);
  const { values, errors, handleChange, handleBlur } = useNodeConfigForm(
    id,
    config,
    WebhookConfigSchema,
    updateNodeConfig,
  );

  const handleSwitchProvider = useCallback(
    (newProvider: ProviderEnum) => {
      handleChange("provider", newProvider);
      const updatedConfig = { ...values, provider: newProvider };
      updateNodeConfig(id, updatedConfig);
    },
    [handleChange, updateNodeConfig, id, values],
  );

  if (!config) return null;

  const providerList = (Object.keys(ProviderMetadata) as ProviderEnum[]).filter(
    (key) => !!ProviderMetadata[key]?.webhookConfigComponent,
  );
  const SelectedConfigComponent = config.provider
    ? ProviderMetadata[config.provider as ProviderEnum]?.webhookConfigComponent
    : null;

  return (
    <div className="space-y-6 p-4">
      <section>
        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-3 block">
          Service Provider
        </label>
        <div className="flex gap-1">
          {providerList.map((providerKey) => {
            const { icon: Icon, color } = ProviderMetadata[providerKey];
            const isSelected = config.provider === providerKey;

            return (
              <button
                key={providerKey}
                onClick={() => handleSwitchProvider(providerKey)}
                className={`flex flex-col w-15 items-center gap-2 p-2 rounded-xl border transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-white shadow-sm"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Icon
                  size={22}
                  style={{ color: isSelected ? color : "#71717a" }}
                />
                <span
                  className="text-[10px] font-bold tracking-tight"
                  style={{ color: isSelected ? color : "#71717a" }}
                >
                  {providerKey}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-zinc-100" />

      <section>
        {SelectedConfigComponent ? (
          <div className="min-h-100 overflow-y-auto">
            <SelectedConfigComponent
              id={id}
              key={`${config.provider}`}
              values={values}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              variables={availableVariables}
            />
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-zinc-100 rounded-xl text-zinc-400 text-xs">
            Select a provider to continue
          </div>
        )}
      </section>
    </div>
  );
}
