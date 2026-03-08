"use client";

import ButtonComponent from "@/app/components/common/Button";
import InputComponent from "@/app/components/common/Input";
import Textarea from "@/app/components/editor/Textarea";
import { FieldWrapper } from "@/app/components/common/FieldWrapper";
import { config } from "@/app/config/config";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { saveCredential } from "@/app/store/credential/credential.api";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiDiscordLogoFill,
  PiCheckCircleFill,
  PiInfoFill,
} from "react-icons/pi";

const DISCORD_INVITE_URL = config.DISCORD_BOT_URL;

export default function DiscordConfig({
  values,
  id,
  handleChange,
  variables,
  errors,
}: any) {
  const user = useAuthStore((state) => state.user);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { fetchUser } = useAuthStore();

  const updateBodyField = useCallback(
    (key: string, value: string) => {
      handleChange("body", { ...values.body, [key]: value }, true);
    },
    [handleChange, values.body],
  );

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
      updateBodyField("channelId", discordCred.credential.channelId);
    }
  }, [user, isEditing]);

  const verifyChannel = async () => {
    if (!values.body?.channelId) return;
    try {
      setVerifying(true);

      const credentialData = {
        name: ProviderEnum.Discord,
        credential: {
          key: values.body.channelId,
          channelId: values.body.channelId,
        },
      };

      const response = await saveCredential(credentialData);

      if (response) {
        setVerified(true);
        setIsEditing(false);
        toast.success("Discord Channel Linked!");
      }
      fetchUser();
    } catch (err) {
      setVerified(false);
      toast.error("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-zinc-900 dark:text-zinc-100">
      {!verified && (
        <div className="space-y-4">
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

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl text-[11px] text-zinc-700 dark:text-zinc-400 space-y-3 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-200">
              <PiInfoFill size={16} className="text-zinc-400" />
              Step 2 — Get Channel ID
            </div>
            <p className="leading-relaxed">
              Right-click your target channel and select{" "}
              <strong>Copy ID</strong>.
            </p>
            <p className="leading-relaxed text-[8px]">
              * You must Turn on Developer Mode from{" "}
              <strong>
                User Settings {">"}
                Advanced
              </strong>
            </p>
          </div>
        </div>
      )}

      <FieldWrapper label="Target Channel ID" error={errors.channelId}>
        <div className="flex gap-2">
          <InputComponent
            value={values.body?.channelId || ""}
            placeholder="e.g. 1234567890..."
            className="flex-1 min-w-1/2"
            disabled={verified}
            onChange={(e) => updateBodyField("channelId", e.target.value)}
          />

          {!verified && (
            <ButtonComponent
              text={verifying ? "..." : "Verify"}
              onClick={verifyChannel}
              disabled={!values.body?.channelId || verifying}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-[11px]"
            />
          )}
        </div>
      </FieldWrapper>

      {verified && (
        <>
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              <PiCheckCircleFill size={16} />
              Channel Verified
            </div>
            <button
              onClick={() => {
                setIsEditing(true);
                setVerified(false);
              }}
              className="underline opacity-70 hover:opacity-100"
            >
              Change
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <FieldWrapper label="Message Template">
              <Textarea
                key={id}
                value={values.body?.message ?? ""}
                placeholder="Hello {{user_name}}, your task is complete!"
                variables={variables}
                onChange={(val) => updateBodyField("message", val)}
              />
            </FieldWrapper>
          </div>
        </>
      )}
    </div>
  );
}
