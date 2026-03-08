"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiKeyFill,
  PiCheckCircleFill,
  PiInfoBold,
  PiSpinnerGap,
  PiCoinsFill,
  PiArrowSquareOutBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { saveCredential } from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";

export default function OpenRouterCredentialForm() {
  const { user, fetchUser } = useAuthStore();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Local state for key details if provided by backend
  const [metadata, setMetadata] = useState<{
    label?: string;
    usage?: number;
    limit?: number;
  } | null>(null);

  useEffect(() => {
    const cred = user?.credentials?.find(
      (c) => c.name === ProviderEnum.OpenRouter,
    );
    setIsConfigured(!!cred);
    if (cred?.metadata) setMetadata(cred.metadata);
  }, [user]);

  const handleConnect = async () => {
    if (!apiKey.startsWith("sk-or-v1-")) {
      toast.error("Please enter a valid OpenRouter API key");
      return;
    }

    setLoading(true);
    try {
      const response = await saveCredential({
        name: ProviderEnum.OpenRouter,
        credential: { key: apiKey },
      });

      if (response) {
        toast.success("OpenRouter Key Integrated");
        await fetchUser();
        setApiKey("");
      }
    } catch (e) {
      toast.error("Failed to verify OpenRouter key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-zinc-900 dark:text-zinc-100">
      {/* CASE 1: NOT CONFIGURED */}
      {!isConfigured && (
        <div className="space-y-4">
          <div className="bg-indigo-50/50 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-[11px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
              <PiKeyFill size={18} />
              OpenRouter Authentication
            </div>
            <p className="leading-relaxed opacity-80">
              OpenRouter provides access to models like Claude 3.5, GPT-4o, and
              Llama 3 via a single API key.
            </p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Get your API Key <PiArrowSquareOutBold />
            </a>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                OpenRouter API Key
              </label>
              <InputComponent
                type="password"
                value={apiKey}
                placeholder="sk-or-v1-..."
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
              />
            </div>

            <ButtonComponent
              text={loading ? "Verifying..." : "Connect OpenRouter"}
              onClick={handleConnect}
              disabled={!apiKey || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            />
          </div>
        </div>
      )}

      {/* CASE 2: CONFIGURED */}
      {isConfigured && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md">
                <PiKeyFill size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-[0.2em]">
                    Key Active
                  </p>
                  <PiCheckCircleFill className="text-emerald-500" size={14} />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {metadata?.label || "OpenRouter Integration"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <PiCoinsFill className="text-zinc-400 mb-1" size={16} />
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-tighter">
                Credits / Limit
              </p>
              <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                {metadata?.limit ? `$${metadata.limit}` : "No Limit Set"}
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <PiInfoBold className="text-zinc-400 mb-1" size={16} />
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-tighter">
                Provider
              </p>
              <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 italic">
                OpenRouter.ai
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
