"use client";

import { useRef } from "react";
import { useFlowStore } from "@/app/store/node/node.store";
import { NodeConfig } from "@/app/store/node/node.schema";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { getNodeRef } from "@/app/utils/nodenaming";
import { Node } from "@xyflow/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CopyableValue, JsonValue } from "../../common/CopyableValue";
import {
  PiMouseFill,
  PiCubeBold,
  PiLightningBold,
  PiTerminalWindowBold,
  PiWarningCircleFill,
} from "react-icons/pi";
import React from "react";
import { IoClose } from "react-icons/io5";

export function ResultPanel({
  nodeId,
  onClose,
}: {
  nodeId: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { parentNodes } = useUpstreamData(nodeId);
  const nodes = useFlowStore((state) => state.nodes) as Node<NodeConfig>[];
  const currentNode = nodes.find((n) => n.id === nodeId);

  useGSAP(
    () => {
      gsap.from(".result-card", {
        opacity: 0,
        x: 10,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [nodeId], scope: panelRef },
  );

  if (!currentNode)
    return (
      <div className="text-center flex flex-col items-center justify-center h-full gap-4 dark:bg-[#0C0C0C] text-zinc-900 dark:text-zinc-100 relative">
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors absolute top-5 left-5"
        >
          <IoClose size={20} />
        </button>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-full">
          <PiMouseFill className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">No node selected</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Select a node on the canvas to configure it
          </p>
        </div>
      </div>
    );

  const currentAlias = getNodeRef(currentNode as any);
  const nodeData = currentNode.data as NodeConfig;
  const currentResult = nodeData.result;
  const nodeError = nodeData.error;
  return (
    <div
      ref={panelRef}
      className="flex flex-col h-full overflow-hidden border-l border-zinc-900 shadow-2xl dark:bg-[#0C0C0C] dark:text-white "
    >
      <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <PiTerminalWindowBold className="text-blue-500" size={16} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em]  ">
            Node Inspector
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-md  text-[9px] font-mono border border-zinc-800">
          {currentAlias}
        </span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-10 custom-scrollbar scroll-smooth">
        {/* INPUTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest whitespace-nowrap">
              Upstream Inputs
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-blue-500/20 to-transparent" />
          </div>

          {parentNodes.length === 0 ? (
            <div className="text-center py-10 text-zinc-600 text-[10px] uppercase tracking-tighter border border-dashed border-zinc-800 rounded-2xl dark:bg-zinc-900 bg-white">
              No input data available
            </div>
          ) : (
            parentNodes.map((parent) => (
              <div
                key={parent.id}
                className="result-card border border-zinc-800 rounded-2xl overflow-hidden dark:bg-zinc-900    backdrop-blur-sm group  transition-colors"
              >
                <div className=" px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiCubeBold size={14} />
                    <span className="text-[11px] font-bold ">
                      {parent.data.label}
                    </span>
                  </div>
                  <CopyableValue
                    nodeId={nodeId}
                    value={parent.data.result}
                    path=""
                    nodeLabel={parent.alias}
                    isContainer
                  />
                </div>
                <div className="p-4 overflow-x-auto ">
                  <JsonValue
                    nodeId={nodeId}
                    value={parent.data.result}
                    path=""
                    nodeLabel={parent.alias}
                    forceDisableCopy={false}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* OUTPUT SECTION */}
        <div className="space-y-4 pb-10">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">
              Node Output
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-emerald-500/20 to-transparent" />
          </div>
          {nodeError && (
            <div className="result-card border border-red-500/30 bg-red-500/5 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-right-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <PiWarningCircleFill className="text-red-500" size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-red-500 uppercase tracking-tighter">
                  Execution Error
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono selection:bg-red-500/30">
                  {nodeError}
                </p>
              </div>
            </div>
          )}

          <div
            className={`result-card rounded-2xl border transition-all duration-500 dark:bg-zinc-900  ${
              !currentResult
                ? "border-zinc-800  italic"
                : "border-emerald-500/50 "
            }`}
          >
            <div className="p-5 overflow-x-auto min-h-25 flex items-center justify-center">
              {currentResult ? (
                <div className="w-full">
                  <JsonValue
                    nodeId={nodeId}
                    value={currentResult}
                    path=""
                    nodeLabel={currentAlias}
                    forceDisableCopy={true}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <PiLightningBold
                    size={20}
                    className="opacity-20 animate-pulse"
                  />
                  <span className="text-[10px] font-medium tracking-tight">
                    Waiting for execution...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
