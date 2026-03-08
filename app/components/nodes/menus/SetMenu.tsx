"use client";

import {
  ManualApiConfigSchema,
  SetConfigSchema,
} from "@/app/store/node/node.schema";
import { useFlowStore } from "@/app/store/node/node.store";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { FieldWrapper } from "../../common/FieldWrapper";
import FieldEditor from "../../common/FieldEditor";

const SetMenu = ({ id }: { id: string }) => {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);

  const { values, errors, handleChange } = useNodeConfigForm(
    id,
    config,
    SetConfigSchema,
    updateNodeConfig,
  );

  if (!config) return null;

  return (
    <div className="space-y-4">
      <FieldWrapper label="Variable Assignments">
        <div className="pt-2 border-t border-zinc-100">
          <FieldEditor
            fields={values.fields || []}
            variables={availableVariables}
            onChange={(newFields) => handleChange("fields", newFields, true)}
          />
        </div>
      </FieldWrapper>
      {errors.fields && (
        <div className="p-2 bg-red-50 border border-red-100 rounded">
          <p className="text-[10px] font-bold text-red-600 uppercase">
            Validation Error
          </p>
          <p className="text-xs text-red-500">{errors.fields}</p>
        </div>
      )}
    </div>
  );
};

export default SetMenu;
