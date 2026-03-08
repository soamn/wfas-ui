"use client";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { DelayConfigSchema } from "@/app/store/node/node.schema";
import { useFlowStore } from "@/app/store/node/node.store";
import { FieldWrapper } from "../../common/FieldWrapper";
import InputComponent from "../../common/Input";
import { PiWarningCircleFill } from "react-icons/pi";

const DelayMenu = ({ id }: { id: string }) => {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);

  const { values, errors, handleBlur, handleChange } = useNodeConfigForm(
    id,
    config,
    DelayConfigSchema,
    updateNodeConfig,
  );

  const blockInvalidChars = (e: React.KeyboardEvent) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const validationError = errors?.seconds;

  if (!config) return null;

  return (
    <div className="space-y-4 p-1">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-zinc-700 dark:text-white">
          Set Delay
        </h3>
        <p className="text-xs text-zinc-500">
          Total delay must be between 1s and 1h.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Hours" error={errors.hours}>
          <InputComponent
            type="number"
            min={0}
            max={1}
            value={values.hours ?? 0}
            onKeyDown={blockInvalidChars}
            onChange={(e) => handleChange("hours", Number(e.target.value))}
            onBlur={() => handleBlur("hours")}
          />
        </FieldWrapper>

        <FieldWrapper label="Minutes" error={errors.minutes}>
          <InputComponent
            type="number"
            min={0}
            max={59}
            value={values.minutes ?? 0}
            onKeyDown={blockInvalidChars}
            onChange={(e) => handleChange("minutes", Number(e.target.value))}
            onBlur={() => handleBlur("minutes")}
          />
        </FieldWrapper>

        <FieldWrapper label="Seconds" error={errors.seconds}>
          <InputComponent
            type="number"
            min={0}
            max={59}
            value={values.seconds ?? 0}
            onKeyDown={blockInvalidChars}
            onChange={(e) => handleChange("seconds", Number(e.target.value))}
            onBlur={() => handleBlur("seconds")}
          />
        </FieldWrapper>

        {/* FIXED TYPO: milliseconds (2 'L's) */}
        <FieldWrapper label="Milliseconds" error={errors.milliseconds}>
          <InputComponent
            type="number"
            min={0}
            max={999}
            value={values.milliseconds ?? 0}
            onKeyDown={blockInvalidChars}
            onChange={(e) =>
              handleChange("milliseconds", Number(e.target.value))
            }
            onBlur={() => handleBlur("milliseconds")}
          />
        </FieldWrapper>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-1">
          <PiWarningCircleFill className="text-red-500 shrink-0" size={16} />
          <p className="text-[10px] text-red-600 dark:text-red-400 font-bold italic leading-tight">
            {validationError}
          </p>
        </div>
      )}
    </div>
  );
};

export default DelayMenu;
