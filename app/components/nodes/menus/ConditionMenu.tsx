"use client";
import { useState, useEffect } from "react";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConnections } from "@xyflow/react";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { ConditionConfigSchema } from "@/app/store/node/node.schema";
import { IoChevronDown } from "react-icons/io5";
import {
  PiWarningCircleFill,
  PiArrowRightBold,
  PiFunctionBold,
  PiCheckCircleFill,
  PiXCircleFill,
} from "react-icons/pi";
import { FieldWrapper } from "../../common/FieldWrapper";
import Textarea from "../../editor/Textarea";

type ValueType = "text" | "number" | "boolean";

const ConditionMenu = ({ id }: { id: string }) => {
  const config = useFlowStore((s) => s.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const connections = useNodeConnections({ id });

  const trueConnection = connections.find(
    (c) => c.source === id && c.sourceHandle === "out_true",
  );
  const falseConnection = connections.find(
    (c) => c.source === id && c.sourceHandle === "out_false",
  );

  const isInputMissing =
    connections.filter((c) => c.target === id).length === 0;

  useEffect(() => {
    if (!config) return;
    if (
      trueConnection?.target !== config.trueNodeId ||
      falseConnection?.target !== config.falseNodeId
    ) {
      updateNodeConfig(id, {
        trueNodeId: trueConnection?.target || "",
        falseNodeId: falseConnection?.target || "",
      });
    }
  }, [trueConnection, falseConnection]);

  // 3. Validation
  useEffect(() => {
    if (!config) return;
    const result = ConditionConfigSchema.safeParse(config);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }
  }, [config]);

  if (!config) return null;

  const valueType: ValueType = config.valueType ?? "text";
  const operator = config.operator ?? "equals";
  const compareValue = config.compareValue;

  const update = (data: Partial<typeof config>) => updateNodeConfig(id, data);

  if (isInputMissing) {
    return (
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start">
        <PiWarningCircleFill
          className="text-amber-500 shrink-0 mt-0.5"
          size={18}
        />
        <div>
          <p className="text-[11px] font-bold text-amber-600 uppercase">
            Input Required
          </p>
          <p className="text-[10px] text-amber-600/70">
            Connect an upstream node to branch from.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <header className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <PiFunctionBold className="text-indigo-500" size={16} />
        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
          Router Logic
        </h3>
      </header>

      {/* Target Property */}
      <FieldWrapper label="Property to Evaluate" error={errors.fieldName}>
        <Textarea
          value={config.fieldName ?? ""}
          placeholder="{{webhook.status}}"
          variables={useUpstreamData(id).availableVariables.filter(
            (v) => !v.path.includes("["),
          )}
          onChange={(val: string) => update({ fieldName: val })}
        />
      </FieldWrapper>

      {/* Evaluation Mode */}
      <FieldWrapper label="Data Format">
        <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
          {(["text", "number", "boolean"] as ValueType[]).map((type) => (
            <button
              key={type}
              onClick={() =>
                update({
                  valueType: type,
                  operator: "equals",
                  compareValue: type === "boolean" ? true : "",
                })
              }
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                valueType === type
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm border border-zinc-200 dark:border-zinc-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FieldWrapper>

      {/* Operator */}
      <FieldWrapper label="Operator" error={errors.operator}>
        <div className="relative">
          <select
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 h-10 text-xs outline-none appearance-none focus:ring-2 ring-indigo-500/10 focus:border-indigo-500"
            value={operator}
            onChange={(e) => update({ operator: e.target.value })}
          >
            <option value="equals">Equals</option>
            <option value="not_equals">Does Not Equal</option>
            {valueType === "text" && (
              <>
                <option value="contains">Contains</option>
                <option value="starts_with">Starts With</option>
              </>
            )}
            {valueType === "number" && (
              <>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
              </>
            )}
            <option value="exists">Exists</option>
          </select>
          <IoChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            size={14}
          />
        </div>
      </FieldWrapper>

      {/* Comparison Value (With Number Guard) */}
      {operator !== "exists" && (
        <FieldWrapper label="Comparison Value" error={errors.compareValue}>
          {valueType === "boolean" ? (
            <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
              {[true, false].map((bool) => (
                <button
                  key={String(bool)}
                  onClick={() => update({ compareValue: bool })}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                    config.compareValue === bool
                      ? "bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm border border-zinc-200 dark:border-zinc-600"
                      : "text-zinc-400"
                  }`}
                >
                  {String(bool)}
                </button>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <PiArrowRightBold size={12} />
              </div>
              <input
                key={valueType}
                type="text"
                inputMode={valueType === "number" ? "numeric" : "text"}
                className="w-full pl-9 pr-3 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500/10 focus:border-indigo-500"
                value={compareValue ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (valueType === "number") {
                    // Block non-numeric entry
                    if (val !== "" && val !== "-" && !/^-?\d*\.?\d*$/.test(val))
                      return;
                    update({
                      compareValue:
                        val === "" || val === "-" ? val : Number(val),
                    });
                  } else {
                    update({ compareValue: val });
                  }
                }}
                placeholder={valueType === "number" ? "0" : "Value to match..."}
              />
            </div>
          )}
        </FieldWrapper>
      )}

      {/* Routing & Handle Status */}
      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
            Output Routing
          </span>
          {errors.trueNodeId || errors.falseNodeId ? (
            <span className="text-[9px] font-bold text-rose-500 animate-pulse">
              Missing Connections
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-colors ${trueConnection ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}
          >
            <div className="flex items-center gap-2">
              {trueConnection ? (
                <PiCheckCircleFill className="text-emerald-500" size={14} />
              ) : (
                <PiXCircleFill className="text-rose-500" size={14} />
              )}
              <span
                className={`text-[10px] font-black uppercase ${trueConnection ? "text-emerald-600" : "text-rose-600"}`}
              >
                If True
              </span>
            </div>
            <p className="text-[8px] text-zinc-400 truncate uppercase tracking-tighter">
              {trueConnection
                ? `Target: ${trueConnection.target.slice(0, 8)}...`
                : "Not Connected"}
            </p>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-colors ${falseConnection ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}
          >
            <div className="flex items-center gap-2">
              {falseConnection ? (
                <PiCheckCircleFill className="text-emerald-500" size={14} />
              ) : (
                <PiXCircleFill className="text-rose-500" size={14} />
              )}
              <span
                className={`text-[10px] font-black uppercase ${falseConnection ? "text-emerald-600" : "text-rose-600"}`}
              >
                If False
              </span>
            </div>
            <p className="text-[8px] text-zinc-400 truncate uppercase tracking-tighter">
              {falseConnection
                ? `Target: ${falseConnection.target.slice(0, 8)}...`
                : "Not Connected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionMenu;
