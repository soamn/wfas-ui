"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiSlackLogoFill,
  PiCheckCircleFill,
  PiPlugFill,
  PiCopyBold,
  PiInfoBold,
} from "react-icons/pi";
import ButtonComponent from "@/app/components/common/Button";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { verifyCredential } from "@/app/store/credential/credential.api";

export default function SlackTriggerConfig() {
  const user = useAuthStore((state) => state.user);
  const id = useWorkflowStore((state) => state.id);
  const [workspace, setWorkspace] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const workflow_id = useWorkflowStore((s) => s.id);

  useEffect(() => {
    const slackCred = user?.credentials.find(
      (c) => c.name === ProviderEnum.Slack,
    );
    setWorkspace(slackCred?.credential || null);
  }, [user]);

  const copyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("ID Copied");
    setTimeout(() => setCopied(false), 2000);
  };
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
        <div className="flex items-center gap-3">
          <PiSlackLogoFill size={18} className="text-[#4A154B]" />
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">
              Bot Status
            </p>
            <p className="text-xs font-semibold text-emerald-600">
              Active & Ready
            </p>
          </div>
        </div>
        <PiCheckCircleFill className="text-emerald-500" size={18} />
      </div>

      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight ml-1">
            Your Workflow Execution Key
          </label>
          <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <code className="flex-1 text-[10px] font-mono truncate text-zinc-600">
              {id}
            </code>
            <button
              onClick={copyId}
              className="p-1.5 hover:bg-zinc-100 rounded-md"
            >
              {copied ? (
                <PiCheckCircleFill className="text-emerald-500" />
              ) : (
                <PiCopyBold />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl  border border-blue-100">
          <PiInfoBold className="text-blue-500 mt-0.5 shrink-0" size={14} />
          <div className="text-[10px]  leading-relaxed">
            To trigger this workflow, simply open <b>Slack</b> and send this ID
            as a direct message to the <b>WFAS Bot</b>.
          </div>
        </div>
      </div>
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
