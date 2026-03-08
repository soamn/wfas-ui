"use client";

import { ManualApiConfigSchema } from "@/app/store/node/node.schema";
import { useFlowStore } from "@/app/store/node/node.store";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import Textarea from "../../editor/Textarea";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { FieldWrapper } from "../../common/FieldWrapper";
import FieldEditor from "../../common/FieldEditor";

const ManualApiMenu = ({ id }: { id: string }) => {
  const config = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const { availableVariables } = useUpstreamData(id);
  const { values, errors, handleChange, handleBlur } = useNodeConfigForm(
    id,
    config,
    ManualApiConfigSchema,
    updateNodeConfig,
  );

  if (!config) return null;

  return (
    <div className="space-y-4 " key={id}>
      <FieldWrapper label="Endpoint" error={errors.apiEndpoint}>
        <div onBlur={() => handleBlur("apiEndpoint")}>
          <Textarea
            key={id}
            value={values.apiEndpoint}
            placeholder="https://api.example.com"
            variables={availableVariables}
            onChange={(val) => handleChange("apiEndpoint", val, true)}
          />
        </div>
      </FieldWrapper>

      <FieldWrapper label="Method">
        <select
          key={id}
          className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 rounded p-2 text-sm"
          value={values.method}
          onChange={(e) => handleChange("method", e.target.value, true)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </FieldWrapper>
      {values.method === "POST" && (
        <FieldWrapper label="Body Parameters">
          <div className="pt-2 border-t border-zinc-100">
            <FieldEditor
              fields={values.body}
              variables={availableVariables}
              onChange={(newFields) => handleChange("body", newFields, true)}
            />
          </div>
        </FieldWrapper>
      )}

      <FieldWrapper label="Retries" error={errors.retry}>
        <input
          type="number"
          key={id}
          className="w-full  bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 outline-0  rounded p-2 text-sm"
          value={values.retry}
          onChange={(e) => handleChange("retry", Number(e.target.value))}
          onBlur={() => handleBlur("retry")}
        />
      </FieldWrapper>

      <FieldWrapper label="Timeout (ms)" error={errors.timeout}>
        <input
          key={id}
          type="number"
          className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 outline-0 rounded p-2 text-sm"
          value={values.timeout}
          onChange={(e) => handleChange("timeout", Number(e.target.value))}
          onBlur={() => handleBlur("timeout")}
        />
      </FieldWrapper>
    </div>
  );
};

export default ManualApiMenu;
