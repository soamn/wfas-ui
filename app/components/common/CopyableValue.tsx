"use client";

import React, { useState, memo, useRef } from "react";
import {
  PiCaretDownFill,
  PiCaretRightFill,
  PiCheck,
  PiCopy,
  PiMouseFill,
  PiCubeBold,
  PiLightningBold,
  PiTerminalWindowBold,
  PiWarningCircleFill,
} from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { useFlowStore } from "@/app/store/node/node.store";
import { NodeConfig } from "@/app/store/node/node.schema";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";
import { getNodeRef } from "@/app/utils/nodenaming";
import { Node } from "@xyflow/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface CopyableProps {
  value: any;
  path: string;
  nodeLabel: string;
  nodeId: string;
  colorClass?: string;
  isContainer?: boolean;
}

export const CopyableValue = memo(function CopyableValue({
  value,
  path,
  nodeLabel,
  colorClass,
  isContainer = false,
}: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const variablePath =
      path === "" ? `{{${nodeLabel}}}` : `{{${nodeLabel}.${path}}}`;
    navigator.clipboard.writeText(variablePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      onClick={handleCopy}
      className={`group relative cursor-pointer inline-flex items-center gap-1.5 transition-all ${colorClass || ""}`}
    >
      {!isContainer && (
        <span className="font-mono text-[11px] font-medium">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </span>
      )}
      <span
        className={`p-1 rounded-md transition-all ${isContainer ? "text-slate-400 hover:text-blue-600 hover:bg-blue-50" : "opacity-0 group-hover:opacity-100 text-blue-500"}`}
      >
        {copied ? (
          <PiCheck size={12} className="text-emerald-600" />
        ) : (
          <PiCopy size={12} />
        )}
      </span>
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-lg z-50">
          Copied
        </span>
      )}
    </span>
  );
});

interface JsonValueProps {
  value: any;
  path: string;
  nodeLabel: string;
  nodeId: string;
  isCopyable?: boolean;
  forceDisableCopy?: boolean;
}

export const JsonValue: React.FC<JsonValueProps> = memo(function JsonValue({
  value,
  path,
  nodeLabel,
  nodeId,
  isCopyable = true,
  forceDisableCopy = false,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const canShowCopy = isCopyable && !forceDisableCopy;

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => !prev);
  };

  if (value === null)
    return (
      <span className="font-mono text-[11px] text-slate-400 italic">null</span>
    );
  if (value === undefined)
    return (
      <span className="font-mono text-[11px] text-slate-400 italic">
        undefined
      </span>
    );

  if (typeof value !== "object") {
    const color =
      typeof value === "string"
        ? "text-emerald-700"
        : typeof value === "number"
          ? "text-amber-700"
          : "text-indigo-700";
    return canShowCopy ? (
      <CopyableValue
        value={value}
        nodeId={nodeId}
        path={path}
        nodeLabel={nodeLabel}
        colorClass={color}
      />
    ) : (
      <span className={`font-mono text-[11px] ${color}`}>
        {JSON.stringify(value)}
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-slate-400 font-mono text-[11px]">[]</span>;
    const isObjectArray =
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      !Array.isArray(value[0]);
    const headers = isObjectArray
      ? Array.from(new Set(value.flatMap(Object.keys)))
      : [];

    return (
      <div
        className="font-mono text-[11px] py-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 group">
          <div
            onClick={toggleCollapse}
            className="flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            {collapsed ? (
              <PiCaretRightFill className="text-slate-400" />
            ) : (
              <PiCaretDownFill className="text-slate-400" />
            )}
            <span className="text-slate-600 font-bold">
              {isObjectArray ? "List" : "Array"}
            </span>
            <span className="text-slate-400 text-[10px]">[{value.length}]</span>
          </div>
          {canShowCopy && (
            <CopyableValue
              nodeId={nodeId}
              value={value}
              path={path}
              nodeLabel={nodeLabel}
              isContainer
            />
          )}
        </div>
        {!collapsed && (
          <div className="mt-1">
            {isObjectArray ? (
              <div className="my-2 ml-2 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-left border-collapse">
                    <thead className="border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="p-2 w-8 text-[9px] text-center font-mono text-slate-300 border-r border-slate-100">
                          #
                        </th>
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-[9px] font-bold text-slate-600 uppercase border-r border-slate-100 last:border-0"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {value.map((row, idx) => {
                        const rowPath = `${path}[${idx}]`;
                        return (
                          <tr
                            key={rowPath}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-2 text-center text-[9px] border-r border-slate-50">
                              <CopyableValue
                                nodeId={nodeId}
                                value={idx}
                                path={rowPath}
                                nodeLabel={nodeLabel}
                                colorClass="text-slate-400"
                              />
                            </td>
                            {headers.map((h) => (
                              <td
                                key={`${rowPath}.${h}`}
                                className="px-3 py-2 border-r border-slate-50 last:border-0 align-top"
                              >
                                <JsonValue
                                  nodeId={nodeId}
                                  value={row[h]}
                                  path={`${rowPath}.${h}`}
                                  nodeLabel={nodeLabel}
                                  forceDisableCopy={forceDisableCopy}
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="pl-4 border-l border-slate-200 ml-2 space-y-1">
                {value.map((item, index) => {
                  const itemPath = `${path}[${index}]`;
                  return (
                    <div key={itemPath} className="flex gap-3 items-start">
                      <CopyableValue
                        nodeId={nodeId}
                        value={index}
                        path={itemPath}
                        nodeLabel={nodeLabel}
                        colorClass="text-slate-300"
                        isContainer
                      />
                      <JsonValue
                        nodeId={nodeId}
                        value={item}
                        path={itemPath}
                        nodeLabel={nodeLabel}
                        forceDisableCopy={forceDisableCopy}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const entries = Object.entries(value);
  if (entries.length === 0)
    return <span className="text-slate-400 font-mono text-[11px]">{"{}"}</span>;

  return (
    <div
      className="font-mono text-[11px] py-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 group">
        <div
          onClick={toggleCollapse}
          className="flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          {collapsed ? (
            <PiCaretRightFill className="text-slate-400" />
          ) : (
            <PiCaretDownFill className="text-slate-400" />
          )}
          <span className="text-slate-600 font-bold">Object</span>
          <span className="text-slate-400 text-[10px]">
            {"{"}
            {entries.length}
            {"}"}
          </span>
        </div>
        {canShowCopy && (
          <CopyableValue
            nodeId={nodeId}
            value={value}
            path={path}
            nodeLabel={nodeLabel}
            isContainer
          />
        )}
      </div>
      {!collapsed && (
        <div className="pl-4 border-l border-slate-200 ml-2 mt-1 space-y-1">
          {entries.map(([k, v]) => {
            const childPath = path ? `${path}.${k}` : k;
            return (
              <div key={childPath} className="flex items-start gap-3">
                <span className="text-slate-500 font-semibold shrink-0">
                  {k}:
                </span>
                <JsonValue
                  nodeId={nodeId}
                  value={v}
                  path={childPath}
                  nodeLabel={nodeLabel}
                  forceDisableCopy={forceDisableCopy}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

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
      className="flex flex-col h-full overflow-hidden border-l border-zinc-900 shadow-2xl dark:bg-[#0C0C0C] dark:text-white"
    >
      <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PiTerminalWindowBold className="text-blue-500" size={16} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
            Node Inspector
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono border border-zinc-800">
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
                className="result-card border border-zinc-800 rounded-2xl overflow-hidden dark:bg-zinc-900 backdrop-blur-sm group transition-colors"
              >
                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiCubeBold size={14} />
                    <span className="text-[11px] font-bold">
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
                <div className="p-4 overflow-x-auto">
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
            className={`result-card rounded-2xl border transition-all duration-500 ${!currentResult ? "border-zinc-800 dark:bg-zinc-900 italic" : "border-emerald-500 "}`}
          >
            <div className="p-5 overflow-x-auto min-h-25 flex items-center justify-center">
              {currentResult ? (
                <div className="w-full ">
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
