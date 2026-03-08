"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiSlackLogoFill,
  PiCheckCircleFill,
  PiPlugFill,
  PiArrowSquareOutBold,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { verifyCredential } from "@/app/store/credential/credential.api";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

export default function SlackCredentialForm() {
  const user = useAuthStore((state) => state.user);
  const workflow_id = useWorkflowStore((s) => s.id);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slackCred = user?.credentials?.find(
      (c) => c.name === ProviderEnum.Slack,
    );
    setWorkspace(slackCred?.credential || null);
  }, [user]);

  const handleConnectSlack = async () => {
    try {
      setLoading(true);
      const payload = {
        name: ProviderEnum.Slack,
        credential: {
          key: "handshake",
          email: user?.email,
          workflow_id: null,
          origin: "profile",
        },
      };

      const res = await verifyCredential(payload);
      if (res?.response?.authUrl) {
        window.location.href = res.response.authUrl;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (e) {
      toast.error("Failed to start Slack authorization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* CASE 1: NOT CONNECTED */}
      {!workspace && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-4">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <PiPlugFill size={20} />
            </div>
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-widest text-[9px]">
                Status: Disconnected
              </p>
              <p className="leading-relaxed opacity-90">
                To send notifications to your team, you need to authorize our
                Slack bot to access your workspace.
              </p>
            </div>
          </div>

          <ButtonComponent
            text={loading ? "Opening Slack..." : "Connect Slack Workspace"}
            onClick={handleConnectSlack}
            disabled={loading}
            className="bg-[#4A154B] hover:bg-[#350d39] text-white w-full rounded-xl py-3 font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-[#4A154B]/20 transition-all active:scale-[0.98]"
          />
        </div>
      )}

      {workspace && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#4A154B] p-2.5 rounded-xl shadow-md">
                <PiSlackLogoFill size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-[0.2em]">
                    Active Connection
                  </p>
                  <PiCheckCircleFill className="text-emerald-500" size={14} />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {workspace.teamName || "Linked Workspace"}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Authorized by {workspace.authedUserEmail || user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 p-4 rounded-xl text-[10px] text-zinc-500 italic">
            Note: To change workspaces, you must first delete this connection
            using the button above.
          </div>
        </div>
      )}
    </div>
  );
}
