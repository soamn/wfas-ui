"use client";

import { useCallback, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  PiTelegramLogoFill,
  PiCheckCircleFill,
  PiWarningBold,
  PiArrowClockwiseBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import Textarea from "@/app/components/editor/Textarea";
import { FieldWrapper } from "@/app/components/common/FieldWrapper";
import { useAuthStore } from "@/app/store/auth/auth.store";
import {
  verifyCredential,
  saveCredential,
} from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";

export default function TelegramConfig({
  values,
  handleChange,
  variables,
}: any) {
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

  const updateBodyField = useCallback(
    (key: string, value: string) => {
      handleChange("body", { ...values.body, [key]: value }, true);
    },
    [handleChange, values.body],
  );

  const handleSetupWebhook = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const isVerified = await verifyCredential({
        name: ProviderEnum.Telegram,
        credential: { key: token },
      });

      if (!isVerified) {
        toast.error("Invalid Token Provided.");
        return;
      }

      // FIX: Removed workflow_id. The backend handles the secret now.
      await saveCredential({
        name: ProviderEnum.Telegram,
        credential: { key: token },
      });

      toast.success("Bot token saved! Now link your chat.");
      await fetchUser();
    } catch (e) {
      toast.error("Failed to link bot.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: No Connection at all
  if (!isTokenSaved) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider">
          <PiTelegramLogoFill size={16} className="text-[#26A5E4]" />
          Setup Bot Connection
        </div>
        <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
          <InputComponent
            type="password"
            placeholder="Bot Token from @BotFather..."
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <ButtonComponent
            text={loading ? "Verifying..." : "Connect Bot"}
            onClick={handleSetupWebhook}
            disabled={!token || loading}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-bold text-[11px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {!isChatLinked ? (
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <PiWarningBold
              size={16}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              Bot connected, but chat is not linked. Send{" "}
              <strong>/setup</strong> to your bot on Telegram to receive
              messages.
            </p>
          </div>
          <button
            onClick={() => fetchUser()}
            className="self-end flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:opacity-70 transition-opacity"
          >
            <PiArrowClockwiseBold className={loading ? "animate-spin" : ""} />
            Refresh Status
          </button>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2">
          <PiCheckCircleFill className="text-emerald-500" size={18} />
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Connection Live
          </div>
        </div>
      )}

      <FieldWrapper label="Message Template">
        <Textarea
          value={values.body?.message ?? ""}
          variables={variables}
          placeholder="Enter message here..."
          onChange={(val) => updateBodyField("message", val)}
        />
      </FieldWrapper>
    </div>
  );
}
