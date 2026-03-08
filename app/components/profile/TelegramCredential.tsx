"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  PiTelegramLogoFill,
  PiCheckCircleFill,
  PiInfoBold,
  PiChatTeardropDotsFill,
  PiArrowClockwiseBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import { useAuthStore } from "@/app/store/auth/auth.store";
import {
  verifyCredential,
  saveCredential,
} from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";

export default function TelegramCredentialForm() {
  const user = useAuthStore((state) => state.user);
  const { fetchUser } = useAuthStore();

  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const telegramCred = useMemo(
    () => user?.credentials.find((cred) => cred.name === ProviderEnum.Telegram),
    [user],
  );

  const isTokenSaved = !!telegramCred;
  const isChatLinked = !!(telegramCred?.credential as any)?.chat_id;

  const handleLinkBot = async () => {
    if (!token) {
      toast.error("Please enter your Bot Token");
      return;
    }

    try {
      setLoading(true);
      const isVerified = await verifyCredential({
        name: ProviderEnum.Telegram,
        credential: { key: token },
      });

      if (!isVerified) {
        toast.error("Invalid Token. Please check @BotFather.");
        return;
      }

      const response = await saveCredential({
        name: ProviderEnum.Telegram,
        credential: { key: token },
      });

      if (response) {
        toast.success("Bot token saved! Now link your chat.");
        await fetchUser();
      }
    } catch (e) {
      toast.error("Failed to link bot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-zinc-900 dark:text-zinc-100">
      {/* CASE 1: NOT CONFIGURED AT ALL */}
      {!isTokenSaved && (
        <div className="space-y-4">
          <div className="bg-sky-50/50 dark:bg-sky-500/10 p-4 rounded-xl border border-sky-100 dark:border-sky-500/20 text-[11px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400 uppercase tracking-tight">
              <PiTelegramLogoFill size={16} />
              Setup Instructions
            </div>
            <p className="leading-relaxed opacity-80">
              1. Message{" "}
              <a
                href="https://t.me/botfather"
                target="_blank"
                className="underline font-bold"
              >
                @BotFather
              </a>
              .<br />
              2. Paste the <strong>API Token</strong> below.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <InputComponent
              type="password"
              value={token}
              placeholder="123456789:ABC..."
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <ButtonComponent
              text={loading ? "Verifying..." : "Link Telegram Bot"}
              onClick={handleLinkBot}
              disabled={!token || loading}
              className="w-full bg-[#26A5E4] text-white py-3 rounded-xl font-bold text-[12px]"
            />
          </div>
        </div>
      )}

      {/* CASE 2: TOKEN SAVED BUT CHAT_ID IS MISSING (PENDING ACTIVATION) */}
      {isTokenSaved && !isChatLinked && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-amber-500 p-2.5 rounded-xl shadow-lg animate-pulse">
              <PiChatTeardropDotsFill size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-black tracking-widest">
                Action Required
              </p>
              <p className="text-sm font-bold">Waiting for Chat Link</p>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your token is saved, but the bot doesn't know where to send
              messages yet.
            </p>
            <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px]">
              👉 Open your bot and send the message:{" "}
              <code className="font-bold text-sky-500">/setup</code>
            </div>
            <button
              onClick={() => fetchUser()}
              className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <PiArrowClockwiseBold className={loading ? "animate-spin" : ""} />
              Check connection status
            </button>
          </div>
        </div>
      )}

      {isTokenSaved && isChatLinked && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-2.5 rounded-xl shadow-md">
                <PiCheckCircleFill size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-[0.2em]">
                    Bot Active
                  </p>
                </div>
                <p className="text-sm font-bold">Connection Verified</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl flex items-start gap-3 border border-zinc-200 dark:border-zinc-800">
            <PiInfoBold className="text-sky-500 mt-0.5 shrink-0" size={16} />
            <div className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Bot linked successfully. Messages will be sent to your Telegram
              account.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
