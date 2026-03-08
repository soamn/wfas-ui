"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useFlowStore } from "@/app/store/node/node.store";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { useNodeConnections } from "@xyflow/react";
import {
  SwitchCaseSchema,
  SwitchConfigSchema,
} from "@/app/store/node/node.schema";
import {
  PiPlusBold,
  PiTrashBold,
  PiGitForkBold,
  PiToggleLeftFill,
  PiToggleRightFill,
  PiWarningCircleBold,
  PiArrowRightBold,
  PiCheckCircleFill,
} from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";
import { z } from "zod";
import Textarea from "../../editor/Textarea";
import { FieldWrapper } from "../../common/FieldWrapper";

type SwitchConfig = z.infer<typeof SwitchConfigSchema>;
type ValueType = "text" | "number" | "boolean";

const OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Contains", value: "contains" },
  { label: "Starts With", value: "starts_with" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Less Than", value: "less_than" },
  { label: "Exists", value: "exists" },
];

export default function SwitchMenu({ id }: { id: string }) {
  const globalConfig = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);
  const connections = useNodeConnections({ id });
  const [config, setConfig] = useState<SwitchConfig>(globalConfig);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config) return;

    let needsUpdate = false;
    const updatedCases = config.cases.map((c) => {
      const conn = connections.find((conn) => conn.sourceHandle === c.id);
      const targetId = conn?.target || "";

      if (targetId !== c.targetNodeId) {
        needsUpdate = true;
        return { ...c, targetNodeId: targetId };
      }
      return c;
    });

    const defaultConn = connections.find(
      (conn) => conn.sourceHandle === "out_default",
    );
    const updatedDefaultId = defaultConn?.target || "";

    if (needsUpdate || updatedDefaultId !== config.defaultNodeId) {
      requestAnimationFrame(() => {
        updateField(
          {
            cases: updatedCases,
            defaultNodeId: updatedDefaultId,
          },
          true,
        );
      });
    }
  }, [connections]);

  const saveToStore = useCallback(
    (next: SwitchConfig, immediate = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (immediate) {
        updateNodeConfig(id, next);
        return;
      }
      debounceRef.current = setTimeout(() => updateNodeConfig(id, next), 250);
    },
    [id, updateNodeConfig],
  );

  const updateField = (updates: Partial<SwitchConfig>, immediate = false) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      saveToStore(next, immediate);
      return next;
    });
  };

  const updateCaseItem = (
    caseId: string,
    updates: Partial<z.infer<typeof SwitchCaseSchema>>,
    immediate = false,
  ) => {
    const nextCases = config.cases.map((c) =>
      c.id === caseId ? { ...c, ...updates } : c,
    );
    updateField({ cases: nextCases }, immediate);
  };

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-200">
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <PiGitForkBold size={18} className="text-orange-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
            Switch Router
          </h3>
        </div>
        <button
          onClick={() =>
            updateField({ showDefault: !config.showDefault }, true)
          }
          className="flex items-center gap-1.5"
        >
          <span className="text-[9px] font-bold text-zinc-400 uppercase">
            Default
          </span>
          {config.showDefault ? (
            <PiToggleRightFill size={22} className="text-orange-500" />
          ) : (
            <PiToggleLeftFill size={22} className="text-zinc-700" />
          )}
        </button>
      </header>

      {/* Property to Evaluate */}
      <FieldWrapper label="Property to Evaluate">
        <div className="relative">
          <select
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 h-10 text-xs outline-none appearance-none focus:border-orange-500 font-medium"
            value={config.referencePath}
            onChange={(e) =>
              updateField({ referencePath: e.target.value }, true)
            }
          >
            <option value="">Select variable...</option>
            {availableVariables.map((v) => (
              <option key={v.path} value={v.path}>
                {v.path}
              </option>
            ))}
          </select>
          <IoChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            size={14}
          />
        </div>
      </FieldWrapper>

      {/* Dynamic Paths */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Logical Paths
          </label>
          <button
            onClick={() =>
              updateField(
                {
                  cases: [
                    ...config.cases,
                    {
                      id: crypto.randomUUID(),
                      operator: "equals",
                      valueType: "text" as const,
                      compareValue: "",
                      targetNodeId: "",
                    },
                  ],
                },
                true,
              )
            }
            className="text-[10px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition-all"
          >
            <PiPlusBold size={12} className="inline mr-1" /> Add Path
          </button>
        </div>

        <div className="space-y-4">
          {config.cases.map((c, index) => (
            <div
              key={c.id}
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg">
                  Path {index + 1}
                </span>
                <button
                  onClick={() =>
                    updateField(
                      {
                        cases: config.cases.filter((item) => item.id !== c.id),
                      },
                      true,
                    )
                  }
                  className="text-zinc-300 hover:text-red-500"
                >
                  <PiTrashBold size={14} />
                </button>
              </div>

              {/* Data Format Segment (Like ConditionMenu) */}
              <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
                {(["text", "number", "boolean"] as ValueType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      updateCaseItem(
                        c.id,
                        {
                          valueType: type,
                          operator: "equals",
                          compareValue: type === "boolean" ? true : "",
                        },
                        true,
                      )
                    }
                    className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                      c.valueType === type
                        ? "bg-white dark:bg-zinc-700 text-orange-600 shadow-sm border border-zinc-200 dark:border-zinc-600"
                        : "text-zinc-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Operator */}
              <div className="relative">
                <select
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 h-10 text-xs outline-none appearance-none focus:border-orange-500 font-medium"
                  value={c.operator}
                  onChange={(e) =>
                    updateCaseItem(c.id, { operator: e.target.value }, true)
                  }
                >
                  {OPERATORS.filter((op) => {
                    if (c.valueType === "number")
                      return [
                        "equals",
                        "not_equals",
                        "greater_than",
                        "less_than",
                        "exists",
                      ].includes(op.value);
                    if (c.valueType === "boolean")
                      return ["equals", "not_equals"].includes(op.value);
                    return true;
                  }).map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
                <IoChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  size={14}
                />
              </div>

              {/* Strict Input Logic (Like ConditionMenu) */}
              {c.operator !== "exists" && (
                <div className="space-y-1">
                  {c.valueType === "boolean" ? (
                    <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
                      {[true, false].map((bool) => (
                        <button
                          key={String(bool)}
                          onClick={() =>
                            updateCaseItem(c.id, { compareValue: bool }, true)
                          }
                          className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                            c.compareValue === bool
                              ? "bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm"
                              : "text-zinc-400"
                          }`}
                        >
                          {String(bool)}
                        </button>
                      ))}
                    </div>
                  ) : c.valueType === "number" ? (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                        <PiArrowRightBold size={12} />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full pl-9 pr-3 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:border-orange-500"
                        value={c.compareValue ?? ""}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (
                            val !== "" &&
                            val !== "-" &&
                            !/^-?\d*\.?\d*$/.test(val)
                          )
                            return;
                          updateCaseItem(
                            c.id,
                            {
                              compareValue:
                                val === "" || val === "-" ? val : Number(val),
                            },
                            false,
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <Textarea
                      variables={availableVariables}
                      value={String(c.compareValue)}
                      onChange={(val) =>
                        updateCaseItem(c.id, { compareValue: val }, false)
                      }
                    />
                  )}
                </div>
              )}

              {/* Handle Status */}
              <div
                className={`flex items-center gap-2 p-2 rounded-lg border text-[9px] font-black uppercase tracking-tight ${c.targetNodeId ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600" : "bg-red-500/5 border-red-500/10 text-red-500 animate-pulse"}`}
              >
                {c.targetNodeId ? (
                  <PiCheckCircleFill size={12} />
                ) : (
                  <PiWarningCircleBold size={12} />
                )}
                {c.targetNodeId
                  ? `Outlet Connected`
                  : "Missing Edge Connection"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Default Output Status */}
      {config.showDefault && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between ${config.defaultNodeId ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" : "bg-amber-500/5 border-amber-500/20"}`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-500 leading-none mb-1">
                Default Fallback
              </span>
              <span className="text-[8px] text-zinc-400 uppercase tracking-tighter">
                {config.defaultNodeId ? "Route Active" : "No Connection"}
              </span>
            </div>
            {config.defaultNodeId ? (
              <PiCheckCircleFill className="text-zinc-400" size={16} />
            ) : (
              <PiWarningCircleBold className="text-amber-500" size={16} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
