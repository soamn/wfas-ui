"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiDiscordLogoFill,
  PiCheckCircleFill,
  PiInfoFill,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import { FieldWrapper } from "@/app/components/common/FieldWrapper";
import { config } from "@/app/config/config";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { saveCredential } from "@/app/store/credential/credential.api";

const DISCORD_INVITE_URL = config.DISCORD_BOT_URL;

export default function DiscordCredentialForm() {
  const user = useAuthStore((state) => state.user);
  const { fetchUser } = useAuthStore();

  const [channelId, setChannelId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const discordCred = user?.credentials?.find(
      (cred) => cred.name === ProviderEnum.Discord,
    );

    if (!discordCred?.credential?.channelId) {
      setVerified(false);
      return;
    }

    if (!isEditing) {
      setVerified(true);
      setChannelId(discordCred.credential.channelId);
    }
  }, [user, isEditing]);

  const handleAddCredential = async () => {
    if (!channelId) {
      toast.error("Please enter a Channel ID");
      return;
    }

    try {
      setVerifying(true);
      await saveCredential({
        name: ProviderEnum.Discord,
        credential: { channelId, key: channelId },
      });

      setVerified(true);
      setIsEditing(false);
      fetchUser();
      toast.success("Discord Credentials Saved!");
    } catch (err) {
      toast.error("Failed to save credentials");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-zinc-900 dark:text-zinc-100">
      {/* Setup Instructions - Only show if not verified or if editing */}
      {(!verified || isEditing) && (
        <div className="space-y-4">
          {/* Step 1: Invite */}
          <div className="bg-indigo-50/50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-[11px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
              <PiDiscordLogoFill size={16} />
              Step 1 — Authorize Bot
            </div>
            <ButtonComponent
              text="Invite Bot to Server"
              onClick={() => window.open(DISCORD_INVITE_URL, "_blank")}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white w-full rounded-lg h-9 text-[11px] font-bold"
            />
          </div>

          {/* Step 2: Instruction */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl text-[11px] text-zinc-700 dark:text-zinc-400 space-y-3 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-200">
              <PiInfoFill size={16} className="text-zinc-400" />
              Step 2 — Get Channel ID
            </div>
            <p className="leading-relaxed">
              Right-click your target channel and select{" "}
              <strong>Copy ID</strong>.
            </p>
            <p className="leading-relaxed text-[8px] opacity-60">
              * Ensure Developer Mode is enabled in Discord Settings {">"}{" "}
              Advanced.
            </p>
          </div>

          {/* Input Section */}
          <FieldWrapper label="Target Channel ID">
            <div className="flex gap-2">
              <InputComponent
                value={channelId}
                placeholder="e.g. 1234567890..."
                className="flex-1"
                onChange={(e) => setChannelId(e.target.value)}
              />
              <ButtonComponent
                text={verifying ? "Saving..." : "Add Credential"}
                onClick={handleAddCredential}
                disabled={!channelId || verifying}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-[11px] whitespace-nowrap"
              />
            </div>
          </FieldWrapper>
        </div>
      )}

      {verified && !isEditing && (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <PiCheckCircleFill size={16} />
            <div>
              <p className="font-bold uppercase tracking-wider text-[9px]">
                Verified Channel
              </p>
              <p className="opacity-80 mt-0.5">{channelId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="underline opacity-70 hover:opacity-100 font-bold uppercase tracking-tighter"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
