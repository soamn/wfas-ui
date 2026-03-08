"use client";
import WorkflowEditor from "@/app/components/workflow/WorkflowEditor";
import { useFlowStore } from "@/app/store/node/node.store";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWorkflow } from "@/app/store/workflow/workflow.api";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

export default function EditPage() {
  const params = useParams();
  const id = params?.id as string;

  const { setWorkflowData } = useWorkflowStore();
  const { setFlow } = useFlowStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkflow = async () => {
      if (!id) return;
      setLoading(true);
      const workflow = await getWorkflow(String(id));

      if (workflow) {
        setWorkflowData({
          ...workflow,
          isEditing: true,
        });
        setFlow(workflow.nodes);
      }

      setLoading(false);
    };

    loadWorkflow();
  }, [id]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center  bg-[#0C0C0C]">
        <div className="animate-pulse text-zinc-500">Loading Workflow...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <WorkflowEditor />
    </div>
  );
}
