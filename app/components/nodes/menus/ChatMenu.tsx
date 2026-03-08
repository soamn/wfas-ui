"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  PiKeyFill,
  PiCaretUpDownBold,
  PiCheckCircleFill,
  PiInfoBold,
} from "react-icons/pi";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { saveCredential } from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { ChatConfigSchema } from "@/app/store/node/node.schema";
import { FieldWrapper } from "../../common/FieldWrapper";
import Textarea from "../../editor/Textarea";
import InputComponent from "@/app/components/common/Input";
import ButtonComponent from "@/app/components/common/Button";

export default function OpenRouterMenu({ id }: { id: string }) {
  const { user, fetchUser } = useAuthStore();
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);

  const { values, handleChange, handleBlur } = useNodeConfigForm(
    id,
    config,
    ChatConfigSchema,
    updateNodeConfig,
  );

  const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyMetadata, setKeyMetadata] = useState<{
    label?: string;
    limit?: number;
  } | null>(null);

  const hasKey = user?.credentials?.find(
    (c) => c.name === ProviderEnum.OpenRouter,
  );

  useEffect(() => {
    if (hasKey) {
      axios.get("https://openrouter.ai/api/v1/models").then((res) => {
        setModels(res.data.data.map((m: any) => ({ id: m.id, name: m.name })));
      });
    }
  }, [hasKey]);

  const handleConnect = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const response = await saveCredential({
        name: ProviderEnum.OpenRouter,
        credential: { key: apiKey },
      });

      fetchUser();
      if (response && response.data.metadata) {
        setKeyMetadata(response.data.metadata);
      }
      setApiKey("");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="p-4 space-y-4 animate-in fade-in zoom-in-95">
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase">
            <PiKeyFill size={14} />
            Connect OpenRouter
          </div>
          <InputComponent
            type="password"
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <ButtonComponent
            text={loading ? "Verifying & Saving..." : "Save API Key"}
            onClick={handleConnect}
            className="w-full bg-indigo-600 text-white rounded-xl py-2 text-[11px] font-bold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-1 animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
        <div className="flex items-center gap-2">
          <PiCheckCircleFill className="text-emerald-500" size={16} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-700 uppercase leading-none">
              {keyMetadata?.label || "API Key Active"}
            </span>
            <span className="text-[9px] text-emerald-600/70 italic">
              Verified via OpenRouter
            </span>
          </div>
        </div>
        {keyMetadata?.limit && (
          <div className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
            Limit: ${keyMetadata.limit}
          </div>
        )}
      </div>

      <FieldWrapper label="AI Model">
        <div className="relative">
          <select
            onBlur={() => handleBlur("model")}
            value={values.model || ""}
            onChange={(e) => handleChange("model", e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[11px] outline-none appearance-none cursor-pointer"
          >
            <option value="">Select a model...</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <PiCaretUpDownBold className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
      </FieldWrapper>

      <FieldWrapper label="System Instructions">
        <div onBlur={() => handleBlur("system")}>
          <Textarea
            key={id + "system"}
            value={values.system ?? ""}
            onChange={(v) => handleChange("system", v)}
            placeholder="You are a helpful assistant..."
            variables={[]}
          />
        </div>
      </FieldWrapper>

      <FieldWrapper label="User Prompt">
        <div onBlur={() => handleBlur("user")}>
          <Textarea
            key={id + "user"}
            value={values.user ?? ""}
            onChange={(v) => handleChange("user", v)}
            placeholder="What should the AI do?"
            variables={[]}
          />
        </div>
      </FieldWrapper>
    </div>
  );
}
