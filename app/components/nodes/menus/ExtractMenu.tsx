"use client";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { ExtractConfigSchema } from "@/app/store/node/node.schema";
import {
  PiListFill,
  PiCheckBold,
  PiDatabaseFill,
  PiCheckCircleFill,
} from "react-icons/pi";

export default function ExtractMenu({ id }: { id: string }) {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);

  const { values, handleChange } = useNodeConfigForm(
    id,
    config,
    ExtractConfigSchema,
    updateNodeConfig,
  );

  const extractedPaths: string[] = values.extractedPaths || [];

  const togglePath = (path: string) => {
    const isSelected = extractedPaths.includes(path);
    const newPaths = isSelected
      ? extractedPaths.filter((p) => p !== path)
      : [...extractedPaths, path];

    handleChange("extractedPaths", newPaths, true);
  };

  return (
    <div className="space-y-4 p-1 animate-in fade-in duration-300" key={id}>
      <header className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <PiListFill size={18} className="text-blue-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
            Field Extractor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/20">
            {extractedPaths.length} Selected
          </span>
        </div>
      </header>

      <div className="bg-blue-500/3 border border-blue-500/10 p-3 rounded-xl">
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
          Whitelisted fields will be kept. All other properties will be removed
          from the payload to keep it lean.
        </p>
      </div>

      <div className="space-y-1.5 max-h-112.5 overflow-y-auto pr-1 custom-scrollbar">
        {availableVariables.map((variable) => {
          const isSelected = extractedPaths.includes(variable.path);

          return (
            <button
              key={variable.path}
              type="button"
              onClick={() => togglePath(variable.path)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 group ${
                isSelected
                  ? "border-blue-500/50 bg-blue-500/5 shadow-[inset_0_0_10px_rgba(59,130,246,0.05)]"
                  : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-col items-start overflow-hidden mr-4">
                <span
                  className={`text-xs font-bold truncate w-full text-left transition-colors ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {variable.path.split(".").pop()}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 truncate w-full text-left mt-0.5">
                  {variable.path}
                </span>
              </div>

              <div
                className={`shrink-0 w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-transparent group-hover:border-zinc-400"
                }`}
              >
                <PiCheckBold
                  size={12}
                  className={isSelected ? "opacity-100" : "opacity-0"}
                />
              </div>
            </button>
          );
        })}

        {availableVariables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <PiDatabaseFill
              size={32}
              className="text-zinc-200 dark:text-zinc-800 mb-3"
            />
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">
              No Data Available
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic mt-1">
              Connect a node to select fields.
            </p>
          </div>
        )}
      </div>

      {extractedPaths.length > 0 && (
        <div className="pt-2 flex items-center gap-2 text-[10px] text-blue-500 font-bold animate-in slide-in-from-bottom-2">
          <PiCheckCircleFill size={14} />
          <span>Payload will be reduced to {extractedPaths.length} keys</span>
        </div>
      )}
    </div>
  );
}
