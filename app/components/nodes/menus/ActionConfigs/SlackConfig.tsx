"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  PiSlackLogoFill,
  PiCheckCircleFill,
  PiPlugFill,
  PiHashFill,
  PiSpinnerGapBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import Textarea from "@/app/components/editor/Textarea";
import { FieldWrapper } from "@/app/components/common/FieldWrapper";
import { config } from "@/app/config/config";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { verifyCredential } from "@/app/store/credential/credential.api";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

export default function SlackConfig({
  values,
  id,
  handleChange,
  handleBlur,
  variables,
  errors,
}: any) {
  const user = useAuthStore((state) => state.user);
  const [workspace, setWorkspace] = useState<any>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);
  const workflow_id = useWorkflowStore((s) => s.id);
  const updateBodyField = useCallback(
    (key: string, value: string) => {
      handleChange("body", { ...values.body, [key]: value }, true);
    },
    [handleChange, values.body],
  );

  useEffect(() => {
    const slackCred = user?.credentials.find(
      (c) => c.name === ProviderEnum.Slack,
    );
    setWorkspace(slackCred?.credential || null);
  }, [user]);

  useEffect(() => {
    if (!workspace || (options.length > 0 && hasInitialized.current)) return;

    const syncSlackData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/credential/slack/channels`, {
          withCredentials: true,
        });
        const channelData = response.data;
        setOptions(channelData);
        if (
          !values.body?.channel &&
          channelData.length > 0 &&
          !hasInitialized.current
        ) {
          updateBodyField("channel", channelData[0].value);
        }

        hasInitialized.current = true;
      } catch (e: any) {
        toast.error("Failed to sync Slack workspace data");
      } finally {
        setLoading(false);
      }
    };

    syncSlackData();
  }, [workspace, updateBodyField, values.body?.channel]);

  const handleConnectSlack = async () => {
    try {
      const payload = {
        name: ProviderEnum.Slack,
        credential: {
          key: "temp_handshake",
          email: user?.email,
          workflow_id: workflow_id,
        },
      };
      const res = await verifyCredential(payload);

      if (res?.response?.authUrl) window.location.href = res.response.authUrl;
    } catch (e) {
      toast.error("Failed to start Slack authorization");
    }
  };

  if (!workspace) return <SlackDisconnected onConnect={handleConnectSlack} />;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
          <PiSlackLogoFill
            size={18}
            className="text-[#4A154B] dark:text-white"
          />
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              Connected To
            </p>
            <p className="text-xs font-semibold">
              {workspace.teamName || "Slack Workspace"}
            </p>
          </div>
        </div>
        <PiCheckCircleFill className="text-emerald-500" size={18} />
      </div>

      <FieldWrapper label="Send To" error={errors.channel}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10 pointer-events-none">
            {loading && options.length === 0 ? (
              <PiSpinnerGapBold className="animate-spin" />
            ) : (
              <PiHashFill size={14} />
            )}
          </div>
          <select
            value={values.body?.channel || ""}
            onChange={(e) => updateBodyField("channel", e.target.value)}
            onBlur={() => handleBlur("channel")}
            disabled={loading && options.length === 0}
            className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[11px] outline-none appearance-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer disabled:opacity-50"
          >
            {!values.body?.channel && (
              <option value="">Select destination...</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {values.body?.channel &&
              !options.find((o) => o.value === values.body.channel) && (
                <option value={values.body.channel}>
                  Selected Destination
                </option>
              )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 1L5 5L9 1" />
            </svg>
          </div>
        </div>
      </FieldWrapper>

      <FieldWrapper label="Message Template" error={errors.message}>
        <Textarea
          key={id}
          value={values.body?.message ?? ""}
          placeholder="Hello team! {{variable}} triggered this alert."
          variables={variables}
          onChange={(val) => updateBodyField("message", val)}
        />
      </FieldWrapper>
    </div>
  );
}

function SlackDisconnected({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-3">
        <PiPlugFill size={18} className="shrink-0" />
        <div className="space-y-1 text-left">
          <p className="font-bold uppercase tracking-tight">
            Slack Not Connected
          </p>
          <p className="opacity-80">
            Authorize Slack to post messages to your workspace.
          </p>
        </div>
      </div>
      <ButtonComponent
        text="Connect Slack Workspace"
        onClick={onConnect}
        className="bg-[#4A154B] hover:bg-[#350d39] text-white w-full rounded-xl py-2.5 font-bold text-[11px]"
      />
    </div>
  );
}
