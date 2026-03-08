"use client";
import { SplitPane, Pane } from "react-split-pane";
import { useEffect, useState } from "react";
import {
  getAllWorkflows,
  getRecentExecutions,
  getWorkflowExecutions,
  deleteWorkflow,
  deleteExecution,
} from "../store/workflow/workflow.api";
import { CustomDivider } from "../components/nodes/ui/Divider";
import { WorkflowTable } from "../components/workflow/WorkflowTable";
import ExecutionLogs, {
  ExecutionLog,
} from "../components/workflow/ExecutionLogs";
import Link from "next/link";
import toast from "react-hot-toast";
import Header from "../components/common/Header";
import { useAuthStore } from "../store/auth/auth.store";

export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  state: "Scheduled" | "Draft" | "Inactive" | "Running" | "Completed";
  createdAt: string;
  updatedAt: string;
}
export default function Page() {
  
  const [workflows, setWorkflows] = useState<WorkflowState[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowState | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const fetchuser = useAuthStore((s) => s.fetchUser);
  useEffect(() => {
    fetchuser();
  }, []);
  const fetchGlobalLogs = async () => {
    setLoadingLogs(true);
    const allLogs = await getRecentExecutions();
    if (allLogs) setExecutionLogs(allLogs);
    setLoadingLogs(false);
  };

  const fetchWorkflows = async () => {
    const res = await getAllWorkflows();
    if (res) setWorkflows(res);
    if (!selectedWorkflow) fetchGlobalLogs();
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSelectWorkflow = async (wf: WorkflowState) => {
    setSelectedWorkflow(wf);
    setLoadingLogs(true);
    const logs = await getWorkflowExecutions(wf.id);
    if (logs) setExecutionLogs(logs);
    setLoadingLogs(false);
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    const success = await deleteWorkflow(workflowId);
    if (success) {
      fetchWorkflows();
    } else {
      toast.error("Failed to delete workflow");
    }
  };

  const handleDeleteLog = async (logId: string) => {
    const success = await deleteExecution(logId);
    if (success) {
      if (selectedWorkflow) {
        handleSelectWorkflow(selectedWorkflow);
      } else {
        fetchGlobalLogs();
      }
    } else {
      toast.error("Failed to delete execution log");
    }
  };

  const handleDeselect = () => {
    if (selectedWorkflow) {
      setSelectedWorkflow(null);
      fetchGlobalLogs();
    }
  };

  return (
    <>
      <Header /> {/* Added Header component here */}
      <div
        className="h-[calc(100vh-64px)] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        onClick={handleDeselect}
      >
        <SplitPane divider={CustomDivider} direction="horizontal">
          <Pane className="p-4 overflow-auto h-full">
            <div
              className="flex items-center justify-between mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold dark:text-white">
                All Workflows
              </h2>
              <Link href="/workflow/create">
                <button className="text-[10px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition">
                  Create Workflow
                </button>
              </Link>
              {selectedWorkflow && (
                <button
                  onClick={handleDeselect}
                  className="text-[10px] bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-300 transition"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <WorkflowTable
                data={workflows}
                onSelect={handleSelectWorkflow}
                selectedId={selectedWorkflow?.id}
                onDeleteWorkflow={handleDeleteWorkflow} // Pass onDeleteWorkflow
              />
            </div>
          </Pane>

          <Pane className="p-4 bg-zinc-50 dark:bg-zinc-800 overflow-auto h-full border-l dark:border-zinc-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              {selectedWorkflow
                ? `Executions for ${selectedWorkflow.name}`
                : "Recent Executions (Global)"}
            </h2>
            {loadingLogs ? (
              <div className="flex justify-center p-10 text-zinc-500">
                Loading logs...
              </div>
            ) : (
              <ExecutionLogs
                logs={executionLogs}
                onDeleteLog={handleDeleteLog}
              />
            )}
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
