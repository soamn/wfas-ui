"use client";

import { useState, useEffect } from "react";
import { useFlowStore } from "@/app/store/node/node.store";
import { FieldWrapper } from "../../common/FieldWrapper";
import { useNodeConnections } from "@xyflow/react";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { FilterConfigSchema } from "@/app/store/node/node.schema";
import Textarea from "../../editor/Textarea";
import { IoChevronDown } from "react-icons/io5";
import { PiWarningCircleFill, PiArrowRightBold } from "react-icons/pi";

type ValueType = "text" | "number" | "boolean";

const getAllowedOperators = (type: ValueType) => {
  if (type === "text")
    return ["equals", "not_equals", "contains", "starts_with", "exists"];
  if (type === "number")
    return ["equals", "not_equals", "greater_than", "less_than", "exists"];
  return ["equals", "not_equals", "exists"];
};

const getDefaultCompareValue = (type: ValueType) => {
  if (type === "boolean") return true;
  if (type === "number") return "";
  return "";
};

const FilterMenu = ({ id }: { id: string }) => {
  const config = useFlowStore((s) => s.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const connections = useNodeConnections({ id });
  const isInputMissing =
    connections.filter((c) => c.target === id).length === 0;

  const { availableVariables } = useUpstreamData(id);
  const filteredVariables = availableVariables.filter(
    (v) => !v.path.includes("["),
  );

  useEffect(() => {
    if (!config) return;

    const result = FilterConfigSchema.safeParse(config);

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!newErrors[key]) {
          newErrors[key] = issue.message;
        }
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

  const allowedOperators = getAllowedOperators(valueType);

  const update = (data: Partial<typeof config>) => {
    updateNodeConfig(id, data);
  };

  const handleTypeChange = (type: ValueType) => {
    const ops = getAllowedOperators(type);

    update({
      valueType: type,
      operator: ops[0],
      compareValue: getDefaultCompareValue(type),
    });
  };

  const handleOperatorChange = (op: string) => {
    if (op === "exists") {
      update({
        operator: op,
        compareValue: undefined,
      });
    } else {
      update({
        operator: op,
        compareValue:
          compareValue === undefined
            ? getDefaultCompareValue(valueType)
            : compareValue,
      });
    }
  };

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
            Connect an upstream node to see available properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
          Condition Logic
        </h3>
      </div>

      <FieldWrapper label="Target Property" error={errors.fieldName}>
        <Textarea
          value={config.fieldName ?? ""}
          placeholder="{{webhook.email}}"
          variables={filteredVariables}
          onChange={(val: string) => update({ fieldName: val })}
        />
      </FieldWrapper>

      <FieldWrapper label="Data Format">
        <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
          {(["text", "number", "boolean"] as ValueType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                valueType === type
                  ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm border border-zinc-200 dark:border-zinc-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FieldWrapper>

      <FieldWrapper label="Operator" error={errors.operator}>
        <div className="relative">
          <select
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 h-10 text-xs outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500"
            value={operator}
            onChange={(e) => handleOperatorChange(e.target.value)}
          >
            {allowedOperators.map((op) => (
              <option key={op} value={op}>
                {op.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <IoChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            size={14}
          />
        </div>
      </FieldWrapper>

      {operator !== "exists" && (
        <FieldWrapper label="Comparison Value" error={errors.compareValue}>
          {valueType === "boolean" ? (
            <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
              {[true, false].map((bool) => (
                <button
                  type="button"
                  key={String(bool)}
                  onClick={() => update({ compareValue: bool })}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                    config.compareValue === bool
                      ? "bg-white dark:bg-zinc-700 text-emerald-600 shadow-sm border border-zinc-200 dark:border-zinc-600"
                      : "text-zinc-400 hover:text-zinc-600"
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
                className="w-full pl-9 pr-3 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500"
                value={compareValue ?? ""}
                onChange={(e) => {
                  const val = e.target.value;

                  if (valueType === "number") {
                    if (!/^-?\d*\.?\d*$/.test(val)) return;

                    update({
                      compareValue: val === "" ? "" : Number(val),
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
    </div>
  );
};

export default FilterMenu;
