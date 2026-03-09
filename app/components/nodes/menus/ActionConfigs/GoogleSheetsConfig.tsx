"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import ButtonComponent from "@/app/components/common/Button";
import { FieldWrapper } from "@/app/components/common/FieldWrapper";
import { useAuthStore } from "@/app/store/auth/auth.store";
import Textarea from "@/app/components/editor/Textarea";
import { ProviderEnum } from "@/app/store/credential/credential.types";
import { config } from "@/app/config/config";

import { BiRefresh, BiLoaderAlt } from "react-icons/bi";
import {
  PiGoogleLogoBold,
  PiCheckCircleFill,
  PiColumnsFill,
} from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";
import { verifyCredential } from "@/app/store/credential/credential.api";
import toast from "react-hot-toast";

export default function GoogleSheetsConfig({
  values,
  handleChange,
  variables,
  errors,
}: any) {
  const user = useAuthStore((state) => state.user);

  const sheetsLoaded = useRef(false);
  const lastFetchedTabsId = useRef<string | null>(null);
  const lastFetchedHeadersPath = useRef<string | null>(null);

  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState({
    sheets: false,
    tabs: false,
    headers: false,
  });

  const [sheetsList, setSheetsList] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [tabs, setTabs] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const fetchSpreadsheets = useCallback(async (force = false) => {
    if (sheetsLoaded.current && !force) return;
    setLoading((prev) => ({ ...prev, sheets: true }));
    try {
      const { data } = await axios.get(`/api/credential/google/sheets`, {
        withCredentials: true,
      });
      setSheetsList(data);
      sheetsLoaded.current = true;
    } catch (e) {
      toast.error("Failed to load spreadsheets");
    } finally {
      setLoading((prev) => ({ ...prev, sheets: false }));
    }
  }, []);

  useEffect(() => {
    const hasCredentials = user?.credentials?.some(
      (cred) => cred.name === ProviderEnum.GoogleSheets,
    );
    setConnected(!!hasCredentials);
    if (hasCredentials && !sheetsLoaded.current) fetchSpreadsheets();
  }, [user?.credentials, fetchSpreadsheets]);

  useEffect(() => {
    const id = values.body?.spreadsheetId;
    if (id && id !== lastFetchedTabsId.current) {
      const fetchTabs = async () => {
        setLoading((prev) => ({ ...prev, tabs: true }));
        try {
          const { data } = await axios.get(
            `/api/credential/google/sheets/${id}/tabs`,
            { withCredentials: true },
          );
          setTabs(data);
          lastFetchedTabsId.current = id;
        } catch (e) {
          toast.error("Error fetching tabs");
        } finally {
          setLoading((prev) => ({ ...prev, tabs: false }));
        }
      };
      fetchTabs();
    }
  }, [values.body?.spreadsheetId]);

  useEffect(() => {
    const id = values.body?.spreadsheetId;
    const tab = values.body?.sheetName;
    const path = `${id}-${tab}`;

    if (id && tab && path !== lastFetchedHeadersPath.current) {
      const fetchHeaders = async () => {
        setLoading((prev) => ({ ...prev, headers: true }));
        try {
          const { data } = await axios.get(
            `/api/credential/google/sheets/${id}/headers?sheetName=${tab}`,
            { withCredentials: true },
          );
          setHeaders(Array.isArray(data.headers) ? data.headers : []);
          lastFetchedHeadersPath.current = path;
        } catch (e) {
          toast.error("Error fetching headers");
        } finally {
          setLoading((prev) => ({ ...prev, headers: false }));
        }
      };
      fetchHeaders();
    }
  }, [values.body?.spreadsheetId, values.body?.sheetName]);

  const updateBodyField = useCallback(
    (key: string, value: any) => {
      handleChange("body", { ...values.body, [key]: value }, true);
    },
    [handleChange, values.body],
  );

  const onSpreadsheetChange = (id: string) => {
    if (id !== values.body?.spreadsheetId) {
      lastFetchedTabsId.current = null;
      lastFetchedHeadersPath.current = null;
      setTabs([]);
      setHeaders([]);

      handleChange(
        "body",
        {
          ...values.body,
          spreadsheetId: id,
          sheetName: "",
          message: {},
        },
        true,
      );
    }
  };

  const onSheetNameChange = (name: string) => {
    if (name !== values.body?.sheetName) {
      lastFetchedHeadersPath.current = null;
      setHeaders([]);
      updateBodyField("sheetName", name);
    }
  };

  const updateColumnValue = useCallback(
    (header: string, val: string) => {
      const currentMapping = values.body?.message || {};
      const updatedMapping = { ...currentMapping, [header]: val };

      updateBodyField("message", updatedMapping);
    },
    [values.body?.message, updateBodyField],
  );

  const handleConnect = async () => {
    try {
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

      if (data?.response?.authUrl) window.location.href = data.response.authUrl;
    } catch (e) {
      toast.error("Authorization failed");
    }
  };

  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100">
      {!connected ? (
        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <PiGoogleLogoBold size={24} className="text-emerald-500" />
            <p className="text-xs font-semibold">Connect Google Sheets</p>
          </div>
          <ButtonComponent
            text="Connect Account"
            onClick={handleConnect}
            className="w-full bg-emerald-600 text-white py-2"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <PiCheckCircleFill className="text-emerald-500" size={18} />
            <span className="text-[11px] font-medium text-emerald-700">
              Google Drive Connected
            </span>
          </div>
          <BiRefresh
            className={`cursor-pointer ${loading.sheets ? "animate-spin" : ""}`}
            onClick={() => {
              sheetsLoaded.current = false;
              fetchSpreadsheets(true);
            }}
          />
        </div>
      )}

      {connected && (
        <div className="space-y-5">
          <FieldWrapper label="Spreadsheet File">
            <div className="relative">
              <select
                className="w-full p-2.5 text-[11px] border rounded-xl bg-zinc-50 dark:bg-zinc-900 outline-none appearance-none cursor-pointer"
                value={values.body?.spreadsheetId || ""}
                onChange={(e) => onSpreadsheetChange(e.target.value)}
              >
                <option value="">
                  {loading.sheets
                    ? "Loading files..."
                    : "Select Spreadsheet..."}
                </option>
                {sheetsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <IoChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                size={14}
              />
            </div>
          </FieldWrapper>

          {values.body?.spreadsheetId ? (
            <FieldWrapper label="Select Sheet (Tab)" error={errors.sheetName}>
              <div className="relative">
                <select
                  className="w-full p-2.5 text-[11px] border rounded-xl bg-zinc-50 dark:bg-zinc-900 outline-none appearance-none cursor-pointer"
                  value={values.body?.sheetName || ""}
                  onChange={(e) => onSheetNameChange(e.target.value)}
                >
                  <option value="">
                    {loading.tabs ? "Loading tabs..." : "Select Tab..."}
                  </option>
                  {tabs.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <IoChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  size={14}
                />
              </div>
            </FieldWrapper>
          ) : (
            <></>
          )}

          {values.body?.sheetName && (
            <div className="pt-4 border-t dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <PiColumnsFill size={14} /> Row Configuration
              </div>

              <div className="space-y-3">
                {loading.headers ? (
                  <div className="flex justify-center py-6">
                    <BiLoaderAlt
                      className="animate-spin text-emerald-500"
                      size={24}
                    />
                  </div>
                ) : headers.length > 0 ? (
                  headers.map((header) => (
                    <div key={header} className="space-y-1.5">
                      <label className="text-[10px] font-medium text-zinc-500 ml-1">
                        {header}
                      </label>
                      <Textarea
                        value={values.body?.message?.[header] || ""}
                        variables={variables}
                        onChange={(val) => updateColumnValue(header, val)}
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="text-sm text-center w-full ">
                      <em>Please Create Headers in Row 1</em>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
