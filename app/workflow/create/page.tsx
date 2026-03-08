"use client";
import WorkflowEditor from "@/app/components/workflow/WorkflowEditor";
import { useFlowStore } from "@/app/store/node/node.store";
import { useEffect, useState } from "react";
import { NodeKind } from "@/app/store/node/node.constants";
import { NodeRegistry } from "@/app/store/node/node.registry";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

export default function Page() {
  const store = useFlowStore();
  const workflowstrore = useWorkflowStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    workflowstrore.resetWorkflow();
    const defaultTrigger = {
      id: crypto.randomUUID(),
      type: NodeKind.TRIGGER,
      position: { x: 200, y: 200 },
      data: NodeRegistry[NodeKind.TRIGGER].defaultData,
    };

    store.setNodes([defaultTrigger]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center  bg-[#0C0C0C]">
        <div className="animate-pulse text-zinc-500">Loading Workflow...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative">
      <WorkflowEditor />
    </div>
  );
}
