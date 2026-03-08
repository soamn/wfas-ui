"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiTelegramLogoFill,
  PiCheckCircleFill,
  PiLockKeyBold,
  PiCopyBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { verifyCredential } from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

export default function TelegramWebhookConfig({ handleChange }: any) {
  const user = useAuthStore((state) => state.user);
  const workflow_id = useWorkflowStore((s) => s.id);
  const { fetchUser } = useAuthStore();
  const [token, setToken] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  const hasCredentials =
    justVerified ||
    user?.credentials?.some((c) => c.name === ProviderEnum.Telegram);
  useEffect(() => {
    handleChange("triggerMessage", workflow_id);
  }, [workflow_id]);

  const handleVerifyToken = async () => {
    if (!token) return;
    setIsVerifying(true);
    try {
      const res = await verifyCredential({
        name: ProviderEnum.Telegram,
        credential: { key: token },
      });

      if (!res.ok) throw new Error();
      fetchUser();
      toast.success("Telegram Bot Linked");
      setJustVerified(true);
    } catch (e) {
      toast.error("Invalid Bot Token");
    } finally {
      setIsVerifying(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(workflow_id);
    toast.success("Workflow ID copied!");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider">
        <PiTelegramLogoFill size={16} className="text-[#26A5E4]" />
        Telegram Trigger
      </div>

      {!hasCredentials ? (
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase">
            <PiLockKeyBold />
            Bot Connection Required
          </div>
          <div className="text-[10px] text-amber-800/70 dark:text-amber-500/70 leading-relaxed">
            Enter your BotFather token to enable this bot to receive trigger
            messages.
          </div>
          <InputComponent
            type="password"
            placeholder="712345678:AAH..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-white dark:bg-zinc-950 border-amber-200/50"
          />
          <ButtonComponent
            text={isVerifying ? "Verifying..." : "Connect Bot"}
            onClick={handleVerifyToken}
            disabled={!token || isVerifying}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-[11px] font-bold"
          />
        </div>
      ) : (
        /* 2. Active State: Bot is linked, show the Execution Key */
        <div className="space-y-3 animate-in zoom-in-95">
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                <PiCheckCircleFill size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-tight">
                  Receiver Active
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Bot is listening for your Workflow ID
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              To trigger this workflow, send the following <b>Execution Key</b>{" "}
              as a message to your Telegram bot.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">
                Workflow ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-[11px] bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 truncate text-zinc-600 dark:text-zinc-400">
                  {workflow_id}
                </div>
                <button
                  onClick={copyId}
                  className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                >
                  <PiCopyBold size={14} className="text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
