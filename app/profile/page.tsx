"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useAuthStore } from "@/app/store/auth/auth.store";
import {
  PiUserCircleFill,
  PiCaretRightBold,
  PiShieldCheckFill,
  PiPlusCircleBold,
  PiTrashFill,
} from "react-icons/pi";
import { getSession } from "../store/auth/auth.api";
import { ProviderEnum } from "../store/credential/credential.types";
import { ProviderMetadata } from "../store/credential/credential.registry";
import DiscordCredentialForm from "../components/profile/DiscordCredential";
import toast from "react-hot-toast";
import { deleteCredential } from "../store/credential/credential.api";
import SlackCredentialForm from "../components/profile/SlackCredential";
import TelegramCredentialForm from "../components/profile/TelegramCredential";
import GoogleSheetsCredentialForm from "../components/profile/GoogleSheetsCredential";
import OpenRouterCredentialForm from "../components/profile/OpenRouterCredential";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const storeAuthData = useAuthStore((s) => s.storeAuthData);
  const [activeTab, setActiveTab] = useState<"profile" | "credentials">(
    "profile",
  );
  const [selectedProvider, setSelectedProvider] = useState<ProviderEnum | null>(
    null,
  );

  const getCredentialForProvider = (providerName: ProviderEnum) => {
    return user?.credentials?.find((c: any) => c.name === providerName);
  };

  useEffect(() => {
    getSession().then((res) => {
      storeAuthData(res.data.user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0C0C0C] transition-colors duration-300">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-72 space-y-2">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => {
              setActiveTab("profile");
              setSelectedProvider(null);
            }}
            icon={<PiUserCircleFill size={20} />}
            label="Account Profile"
          />
          <TabButton
            active={activeTab === "credentials"}
            onClick={() => setActiveTab("credentials")}
            icon={<PiShieldCheckFill size={20} />}
            label="API Credentials"
          />
        </aside>

        <main className="flex-1 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
          {activeTab === "profile" ? (
            <ProfileInfo user={user} />
          ) : selectedProvider ? (
            <CredentialEditor
              provider={selectedProvider}
              onBack={() => setSelectedProvider(null)}
            />
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black dark:text-white">
                  Credentials
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Manage your integration keys and access tokens.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(ProviderEnum).map((provider) => {
                  const meta = ProviderMetadata[provider];
                  const credential = getCredentialForProvider(provider);
                  const isConfigured = !!credential;

                  return (
                    <button
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={`group relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${
                        isConfigured
                          ? "bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 shadow-md hover:scale-[1.02]"
                          : "bg-zinc-50/50 dark:bg-zinc-900/20 border-dashed border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {meta?.icon && (
                          <meta.icon
                            size={30}
                            style={{ color: meta.color }}
                            className="dark:brightness-150"
                          />
                        )}
                        <div className="text-left">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                            {provider}
                          </h3>
                          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                            {isConfigured ? "Connected" : "Not Configured"}
                          </span>
                        </div>
                      </div>

                      {isConfigured ? (
                        <PiCaretRightBold className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                      ) : (
                        <PiPlusCircleBold
                          className="text-zinc-300 group-hover:text-blue-500 transition-colors"
                          size={20}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
      active
        ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-700"
        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
    }`}
  >
    {icon}
    {label}
  </button>
);

const ProfileInfo = ({ user }: any) => (
  <div className="space-y-10">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
        {user?.name?.[0] || "U"}
      </div>
      <div>
        <h2 className="text-3xl font-black dark:text-white">{user?.name}</h2>
        <p className="text-zinc-500">{user?.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
      <InfoBlock label="Account Status" value="Active" />
      <InfoBlock label="Member Since" value="February 2026" />
    </div>
  </div>
);

const InfoBlock = ({ label, value }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
      {label}
    </label>
    <p className="text-zinc-900 dark:text-zinc-100 font-semibold">{value}</p>
  </div>
);

const CredentialEditor = ({
  provider,
  onBack,
}: {
  provider: ProviderEnum;
  onBack: () => void;
}) => {
  const { user, fetchUser } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfigured = !!user?.credentials?.find(
    (c: any) => c.name === provider,
  );

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to remove your ${provider} credentials?`,
      )
    )
      return;

    try {
      setIsDeleting(true);
      await deleteCredential(provider);
      toast.success(`${provider} credentials removed`);
      fetchUser();
      onBack();
    } catch (err) {
      toast.error("Failed to remove credentials");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          ← Back to Providers
        </button>

        {isConfigured && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <PiTrashFill size={18} />
            {isDeleting ? "Removing..." : "Delete Connection"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-black dark:text-white">
            {provider} Credentials
          </h2>
          <p className="text-zinc-500 text-sm">
            {isConfigured
              ? "Update your existing configuration"
              : "Configure a new connection"}
          </p>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/80 p-6 rounded-3xl shadow-inner dark:shadow-none border border-zinc-100 dark:border-zinc-800">
        {provider === ProviderEnum.Discord && <DiscordCredentialForm />}
        {provider === ProviderEnum.Slack && <SlackCredentialForm />}
        {provider === ProviderEnum.Telegram && <TelegramCredentialForm />}
        {provider === ProviderEnum.OpenRouter && <OpenRouterCredentialForm />}
        {provider === ProviderEnum.GoogleSheets && (
          <GoogleSheetsCredentialForm />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
