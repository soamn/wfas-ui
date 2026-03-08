"use client";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import Textarea from "../../editor/Textarea";
import InputComponent from "../../common/Input";
import { TransformConfigSchema } from "@/app/store/node/node.schema";
import {
  PiGearSixFill,
  PiArrowRightBold,
  PiArrowsLeftRightBold,
  PiTerminalWindowFill,
} from "react-icons/pi";

export default function TransformMenu({ id }: { id: string }) {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);

  const { values, handleChange } = useNodeConfigForm(
    id,
    config,
    TransformConfigSchema,
    updateNodeConfig,
  );

  const transforms = values.transforms || [];

  const updateTransform = (variablePath: string, updates: any) => {
    const existingIndex = transforms.findIndex(
      (t: any) => t.originalPath === variablePath,
    );
    let newTransforms = [...transforms];

    if (existingIndex > -1) {
      newTransforms[existingIndex] = {
        ...newTransforms[existingIndex],
        ...updates,
      };
    } else {
      const initialKey = variablePath.split(".").pop() || "key";
      newTransforms.push({
        originalPath: variablePath,
        changedKey: initialKey,
        changedValue: `{{${variablePath}}}`,
        ...updates,
      });
    }
    handleChange("transforms", newTransforms, true);
  };

  const removeTransform = (path: string) => {
    handleChange(
      "transforms",
      transforms.filter((t: any) => t.originalPath !== path),
      true,
    );
  };

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-300" key={id}>
      <header className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <PiGearSixFill size={18} className="text-indigo-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
            Data Mapper
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
          {availableVariables.length} Props
        </span>
      </header>

      <div className="space-y-3">
        {availableVariables.map((variable) => {
          const transform = transforms.find(
            (t: any) => t.originalPath === variable.path,
          );
          const isTransformed = !!transform;

          return (
            <div
              key={variable.path}
              className={`group rounded-2xl border transition-all duration-200 ${
                isTransformed
                  ? "border-indigo-500/30 bg-indigo-500/3 shadow-sm"
                  : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950/50"
              }`}
            >
              <div className="p-3 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <PiTerminalWindowFill
                      className="text-zinc-400 shrink-0"
                      size={12}
                    />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                      Source Path
                    </span>
                  </div>
                  <code className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 truncate">
                    {variable.path}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    isTransformed
                      ? removeTransform(variable.path)
                      : updateTransform(variable.path, {})
                  }
                  className={`text-[10px] px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap border ${
                    isTransformed
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20"
                      : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent hover:opacity-80 shadow-md shadow-zinc-500/10"
                  }`}
                >
                  {isTransformed ? "Reset" : "Transform"}
                </button>
              </div>

              {isTransformed && (
                <div className="px-3 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="h-px bg-indigo-500/10 mx-2" />
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">
                      Mapped Output Key
                    </label>
                    <InputComponent
                      className="border-indigo-500/20! focus:border-indigo-500! focus:ring-indigo-500/10!"
                      value={transform.changedKey}
                      onChange={(e: any) =>
                        updateTransform(variable.path, {
                          changedKey: e.target.value,
                        })
                      }
                      placeholder="e.g. user_email"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">
                      Transformation Logic
                    </label>
                    <Textarea
                      key={`${id}-${variable.path}`}
                      value={transform.changedValue || `{{${variable.path}}}`}
                      variables={availableVariables}
                      onChange={(val: string) =>
                        updateTransform(variable.path, { changedValue: val })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/10">
                    <span className="opacity-60 truncate font-mono">
                      {variable.path}
                    </span>
                    <PiArrowsLeftRightBold
                      className="shrink-0 text-indigo-500"
                      size={14}
                    />
                    <span className="font-mono bg-indigo-500 text-white dark:text-indigo-950 px-1.5 rounded-md">
                      {transform.changedKey || "..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
