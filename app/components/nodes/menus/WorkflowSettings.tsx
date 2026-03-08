"use client";

import { ThemeToggle } from "@/app/components/common/ToggleButton";
import { useFlowStore } from "@/app/store/node/node.store";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";
import {
  CiSettings,
  CiMonitor,
  CiViewTable,
  CiCircleInfo,
  CiDatabase,
} from "react-icons/ci";
import { IoClose } from "react-icons/io5";

interface SidebarProps {
  onClose: () => void;
  showConfig: boolean;
  setShowConfig: (val: boolean) => void;
  showResult: boolean;
  setShowResult: (val: boolean) => void;
}
const Switch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? "bg-sky-300" : "bg-zinc-300 dark:bg-zinc-700"
    }`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const WorkflowSettings = ({
  onClose,
  showConfig,
  setShowConfig,
  showResult,
  setShowResult,
}: SidebarProps) => {
  const workflow = useWorkflowStore();
  const saveWf = useFlowStore((state) => state.saveWorkflow);
  return (
    <div className="flex flex-col w-80 h-112.5 absolute top-1 right-0  bg-white dark:bg-[#0C0C0C] text-zinc-900 dark:text-zinc-100 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="flex items-center gap-2">
          <CiSettings className=" w-5 h-5" />
          <h2 className="font-bold text-xs uppercase tracking-tight">
            Workspace Settings
          </h2>
          <p className="text-[9px] text-zinc-400 font-mono">CTRL + E</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          <IoClose size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <CiCircleInfo /> Identity
          </label>
          <div className="space-y-3 p-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-medium">
                Description
              </span>
              <textarea
                defaultValue={workflow.description}
                onChange={(e) =>
                  workflow.setWorkflowData({ description: e.target.value })
                }
                rows={2}
                className="p-2 w-full bg-white dark:bg-zinc-900 outline-0 rounded border border-zinc-200 dark:border-zinc-800 font-sans text-[11px] resize-none focus:ring-1 ring-sky-500/50"
                placeholder="What does this flow do?"
              />
            </div>
          </div>
        </section>

        {/* VIEW TOGGLES */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Interface
          </label>

          <div className="space-y-1.5">
            {/* Config Sidebar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                  <CiMonitor size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">Config Sidebar</p>
                  <p className="text-[9px] text-zinc-400 font-mono">CTRL + M</p>
                </div>
              </div>
              <Switch enabled={showConfig} onChange={setShowConfig} />
            </div>

            {/* Result Panel */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                  <CiViewTable size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">Result Panel</p>
                  <p className="text-[9px] text-zinc-400 font-mono">CTRL + J</p>
                </div>
              </div>
              <Switch enabled={showResult} onChange={setShowResult} />
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <CiDatabase /> Engine Status
          </label>
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-medium">Active Monitoring</p>
              <p className="text-[9px] text-zinc-500">Allow execution logs</p>
            </div>
            <Switch
              enabled={workflow.isActive}
              onChange={(val) => workflow.setWorkflowData({ isActive: val })}
            />
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Appearance
          </label>
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-medium">Theme Mode</span>
            <ThemeToggle />
          </div>
        </section>
        {!workflow.isEditing ? (
          <section className="space-y-3">
            <button
              onClick={saveWf}
              className="px-1 py-2 bg-emerald-400 hover:bg-emerald-600 w-full rounded-xl"
            >
              Save
            </button>
          </section>
        ) : (
          <section className="space-y-3">
            <button
              onClick={saveWf}
              className="px-1 py-2 bg-emerald-400 hover:bg-emerald-600 w-full rounded-xl"
            >
              Update
            </button>
          </section>
        )}
      </div>
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-[9px] text-zinc-400 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded flex justify-between">
            <span>Search</span>
            <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">
              CTRL + K
            </span>
          </div>
          <div className="text-[9px] text-zinc-400 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded flex justify-between">
            <span>Delete</span>
            <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">
              Del
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSettings;
