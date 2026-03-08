"use client";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { FieldWrapper } from "../../common/FieldWrapper";
import { FailConfigSchema } from "@/app/store/node/node.schema";
import { PiWarningOctagonBold, PiChatCenteredDotsBold } from "react-icons/pi";
import InputComponent from "../../common/Input";

export default function FailMenu({ id }: { id: string }) {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);

  const { values, handleChange, handleBlur } = useNodeConfigForm(
    id,
    config,
    FailConfigSchema,
    updateNodeConfig,
  );

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-300">
      <header className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <PiWarningOctagonBold size={18} className="text-red-500" />
        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
          Termination Config
        </h3>
      </header>

      <FieldWrapper
        label="Response Message"
        description="This message will be visible on the node and in execution logs."
      >
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
            <PiChatCenteredDotsBold size={16} />
          </div>
          <InputComponent
            className="pl-10 border-zinc-200! dark:border-zinc-800! focus:border-red-500! focus:ring-red-500/10!"
            value={values.errorMessage ?? ""}
            onChange={(e: any) =>
              handleChange("errorMessage", e.target.value, false)
            }
            onBlur={() => handleBlur("errorMessage")}
            placeholder="Workflow failed at this step."
          />
        </div>
      </FieldWrapper>

      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
        <p className="text-[10px] text-red-600 dark:text-red-400 leading-relaxed font-medium">
          <strong>Note:</strong> Reaching this node immediately halts the flow.
          Ensure all necessary cleanup (like database closes) happens before
          this step.
        </p>
      </div>
    </div>
  );
}
