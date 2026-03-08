"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiGoogleLogoBold,
  PiCheckCircleFill,
  PiPlugFill,
  PiArrowSquareOutBold,
  PiFilesFill,
} from "react-icons/pi";

import ButtonComponent from "@/app/components/common/Button";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { verifyCredential } from "@/app/store/credential/credential.api";

export default function GoogleSheetsCredentialForm() {
  const user = useAuthStore((state) => state.user);
  const { fetchUser } = useAuthStore();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasCredentials = user?.credentials?.some(
      (cred) => cred.name === ProviderEnum.GoogleSheets,
    );
    setConnected(!!hasCredentials);
  }, [user?.credentials]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const payload = {
        name: ProviderEnum.GoogleSheets,
        credential: {
          key: user?.email,
          email: user?.email,
          returnUrl: window.location.href,
        },
        email: user?.email,
      };

      const data = await verifyCredential(payload as any);

      if (data?.response?.authUrl) {
        window.location.href = data.response.authUrl;
      } else {
        throw new Error("No Auth URL returned");
      }
    } catch (e) {
      toast.error("Google Authorization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-zinc-900 dark:text-zinc-100">
      {/* CASE 1: NOT CONNECTED */}
      {!connected && (
        <div className="space-y-4">
          <div className="bg-emerald-50/50 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-[11px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
              <PiGoogleLogoBold size={18} />
              Google Sheets Integration
            </div>
            <p className="leading-relaxed opacity-80">
              By connecting your Google account, you allow the platform to:
            </p>
            <ul className="space-y-1.5 ml-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                List Spreadsheets from your Drive
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                Read headers and append new rows
              </li>
            </ul>
          </div>

          <ButtonComponent
            text={loading ? "Opening Google..." : "Connect Google Account"}
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          />
        </div>
      )}

      {/* CASE 2: CONNECTED */}
      {connected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                <PiGoogleLogoBold size={24} className="text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-[0.2em]">
                    Authorized
                  </p>
                  <PiCheckCircleFill className="text-emerald-500" size={14} />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Google Drive Connected
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Accessing as {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <PiFilesFill className="text-zinc-400 mb-1" size={16} />
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-tighter">
                Usage
              </p>
              <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                Append Rows
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <PiPlugFill className="text-zinc-400 mb-1" size={16} />
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-tighter">
                Status
              </p>
              <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                Live
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
