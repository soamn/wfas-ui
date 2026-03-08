"use client";
import { useEffect } from "react";
import { useFlowStore } from "@/app/store/node/node.store";
import { useNodeConfigForm } from "@/app/hooks/useNodeConfigForm";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { useNodeConnections } from "@xyflow/react";
import { LoopConfigSchema } from "@/app/store/node/node.schema";
import { FieldWrapper } from "../../common/FieldWrapper";
import Textarea from "../../editor/Textarea";
import InputComponent from "../../common/Input";
import {
  PiRepeatFill,
  PiInfoFill,
  PiCheckCircleFill,
  PiWarningCircleBold,
} from "react-icons/pi";

export default function LoopMenu({ id }: { id: string }) {
  const globalConfig = useFlowStore((state) => state.getNodeConfig(id));
  const updateNodeConfig = useFlowStore((state) => state.updateNodeConfig);
  const connections = useNodeConnections({ id });
  const { availableVariables } = useUpstreamData(id);

  const { values, handleChange, errors } = useNodeConfigForm(
    id,
    globalConfig,
    LoopConfigSchema,
    updateNodeConfig,
  );

  useEffect(() => {
    const iterConn = connections.find((c) => c.sourceHandle === "iterate");
    const nextConn = connections.find((c) => c.sourceHandle === "next");

    if (
      iterConn?.target !== values.iterateNodeId ||
      nextConn?.target !== values.nextNodeId
    ) {
      const timer = setTimeout(() => {
        handleChange("iterateNodeId", iterConn?.target || "", true);
        handleChange("nextNodeId", nextConn?.target || "", true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [connections]);

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-300">
      <header className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <PiRepeatFill size={18} className="text-orange-500" />
        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
          Loop Logic
        </h3>
      </header>

      <div className="space-y-5">
        <FieldWrapper label="Source Array" error={errors?.loopOver}>
          <Textarea
            value={values.loopOver ?? ""}
            onChange={(v) => handleChange("loopOver", v, true)}
            variables={availableVariables}
            placeholder="{{data.items_list}}"
          />
        </FieldWrapper>

        {/* LIVE ROUTING VALIDATION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
            Connection Validation
          </label>

          <div className="space-y-2">
            {/* Per-Item Path Validation */}
            <div
              className={`flex flex-col gap-1 p-2 rounded-lg border transition-colors ${
                values.iterateNodeId
                  ? "bg-orange-50/30 border-orange-100"
                  : "bg-red-50/50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${values.iterateNodeId ? "text-amber-700" : "text-red-600"}`}
                >
                  Per-Item Path (Iterator)
                </span>
                {values.iterateNodeId ? (
                  <PiCheckCircleFill className="text-orange-500" />
                ) : (
                  <PiWarningCircleBold className="text-red-500 animate-pulse" />
                )}
              </div>
              {!values.iterateNodeId && (
                <span className="text-[9px] text-red-400 font-medium">
                  Missing connection to loop body
                </span>
              )}
            </div>

            {/* Completion Path Validation */}
            <div
              className={`flex flex-col gap-1 p-2 rounded-lg border transition-colors ${
                values.nextNodeId
                  ? "bg-zinc-50 border-zinc-200"
                  : "bg-red-50/50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${values.nextNodeId ? "text-zinc-700" : "text-red-600"}`}
                >
                  Completion Path (Next)
                </span>
                {values.nextNodeId ? (
                  <PiCheckCircleFill className="text-emerald-500" />
                ) : (
                  <PiWarningCircleBold className="text-red-500 animate-pulse" />
                )}
              </div>
              {!values.nextNodeId && (
                <span className="text-[9px] text-red-400 font-medium">
                  Missing connection for after loop
                </span>
              )}
            </div>
          </div>
        </div>

        <FieldWrapper label="Iteration Limit" error={errors?.maxIterations}>
          <input
            type="number"
            value={values.maxIterations}
            onChange={(e) => {
              const val =
                e.target.value === "" ? 0 : parseInt(e.target.value, 10);
              handleChange("maxIterations", val, true);
            }}
          />
        </FieldWrapper>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-4 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 space-y-2">
        <div className="flex items-center gap-2 text-orange-600">
          <PiInfoFill size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Iteration Context
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Nodes on the <span className="text-orange-600 font-bold">Right</span>{" "}
          handle can use:
          <code className="block mt-1 font-mono text-orange-600 p-1 bg-white rounded border border-orange-100">
            {"{{loop_item}}"}
          </code>
        </p>
      </div>
    </div>
  );
}
