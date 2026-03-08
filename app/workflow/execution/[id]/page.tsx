"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExecutionResult } from "@/app/store/workflow/workflow.api";
import JsonViewer from "@/app/components/common/JsonViewer";
import {
  PiCheckCircleFill,
  PiWarningCircleFill,
  PiClockFill,
} from "react-icons/pi";

interface ExecutionResult {
  id: number;
  workflowId: string;
  status: string;
  resultData: Record<string, any> | null;
  startedAt: string;
  endTime: string;
  error?: string | null;
}

const ExecutionResultPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchResult = async () => {
        setLoading(true);
        const result = await getExecutionResult(id);
        if (result) {
          setExecutionResult(result);
        }
        setLoading(false);
      };
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen animate-pulse text-zinc-500 font-medium">
        Loading execution details...
      </div>
    );
  }

  if (!executionResult) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Could not load execution details.
      </div>
    );
  }

  const nodeEntries = Object.entries(executionResult.resultData ?? {});
  const isRunning = executionResult.status === "Running";

  return (
    <div className="p-8 bg-white dark:bg-[#0C0C0C] dark:text-zinc-100 min-h-screen">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Run #{executionResult.id}
            {isRunning && (
              <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded animate-pulse">
                LIVE
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            {executionResult.workflowId}
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm ${
            executionResult.status === "Completed"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : isRunning
                ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {isRunning ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          ) : executionResult.status === "Completed" ? (
            <PiCheckCircleFill />
          ) : (
            <PiWarningCircleFill />
          )}
          {executionResult.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label="Start Time"
          value={new Date(executionResult.startedAt).toLocaleString()}
        />
        <StatCard
          label="End Time"
          value={new Date(executionResult.endTime).toLocaleString()}
        />
        <StatCard
          label="Duration"
          value={`${(new Date(executionResult.endTime).getTime() - new Date(executionResult.startedAt).getTime()) / 1000}s`}
        />
      </div>

      <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
        <PiClockFill className="text-blue-500" /> Trace Output
      </h2>

      <div className="space-y-4">
        {nodeEntries.map(([nodeLabel, output]) => (
          <div
            key={nodeLabel}
            className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900/50">
              <h3 className="font-bold text-sm font-mono text-blue-600 dark:text-blue-400">
                {nodeLabel}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                {output === null ? "Skipped / Trigger" : "Resolved"}
              </span>
            </div>

            <div className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Output Data
              </h4>
              {output ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <JsonViewer data={output} />
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  No output data captured for this node.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {executionResult.error && (
        <div className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
          <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
            <PiWarningCircleFill /> Critical Error
          </h4>
          <pre className="text-xs text-red-600 dark:text-red-400 font-mono overflow-auto whitespace-pre-wrap">
            {executionResult.error}
          </pre>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
      {label}
    </h3>
    <p className="font-bold text-sm truncate">{value}</p>
  </div>
);

export default ExecutionResultPage;
