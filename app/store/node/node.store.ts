import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";

import {
  isValidConnection,
  transformToBackendFormat,
} from "../../utils/workflowStructure";
import toast from "react-hot-toast";
import { useWorkflowStore } from "../workflow/workflow.store";
import {
  createWorkflowRequest,
  executeWorkflowRequest,
  getWorkflow,
  updateWorkflowRequest,
} from "../workflow/workflow.api";
import { NodeConfig, WorkflowPayloadSchema } from "./node.schema";

interface FlowState {
  getSerializedWorkflow(): unknown;
  nodes: Node[];
  edges: Edge[];
  isDirty: boolean;
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setFlow: (nodes: any[]) => void;
  setSelectedNode: (id: string | null) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  deleteSelected: () => void;
  updateNodeConfig: (nodeId: string, newConfig: Partial<any>) => void;
  getNodeConfig: (nodeId: string) => any | undefined;
  executeWorkflow: () => void;
  saveWorkflow: () => void;
  pollWorkflow: (nodeId: string) => void;
  validateWorkflow: (nodes: Node[], edges: Edge[]) => boolean;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isDirty: false,

  validateWorkflow: (nodes, edges) => {
    const ENTRY_TYPES = ["WEBHOOK", "TRIGGER"];

    const triggerNodes = nodes.filter((n) =>
      ENTRY_TYPES.includes(n.type as string),
    );

    if (triggerNodes.length === 0) {
      toast.error("At least one trigger node is needed.", {
        id: "trigger-exists",
      });
      return false;
    }

    const backendPayload = transformToBackendFormat(nodes, edges);

    if (backendPayload.length === 0) {
      toast.error(
        "Your trigger must be connected to at least one actionable node.",
        {
          id: "trigger-not-connected",
        },
      );
      return false;
    }

    if (
      backendPayload[0].type &&
      !ENTRY_TYPES.includes(backendPayload[0].type)
    ) {
      toast.error("The flow must start with a trigger node.", {
        id: "trigger-first",
      });
      return false;
    }

    return true;
  },
  setFlow: (backendNodes: any[]) => {
    const nodes = backendNodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: {
        label: n.label,
        result: n.result,
        error: n.error,
        status: n.status,
        type: n.type,
        config: n.config,
      },
    }));

    const edges = backendNodes.flatMap((n) =>
      (n.connections || []).map((conn: any) => ({
        id: `edge-${conn.sourceNodeId}-${conn.sourceHandle}-${conn.targetNodeId}-${conn.targetHandle}`,
        source: conn.sourceNodeId,
        target: conn.targetNodeId,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      })),
    );

    set({ nodes, edges });
  },
  setNodes: (nodes) => {
    const ENTRY_TYPES = ["WEBHOOK", "TRIGGER"];
    const entryCount = nodes.filter((n) =>
      ENTRY_TYPES.includes(n.type as string),
    ).length;

    if (entryCount > 1) {
      toast.error("Workflow can only have one trigger node.", {
        id: "trigger-validation",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
        },
      });
      return;
    }

    set({ nodes, isDirty: false });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true });
  },

  onEdgesChange: (changes) => {
    const currentEdges = get().edges;
    const nextEdges = applyEdgeChanges(changes, currentEdges);
    const styledEdges = nextEdges.map((edge) => {
      const isSelected = edge.selected;
      return {
        ...edge,
        animated: isSelected ? true : edge.animated,
        style: {
          ...edge.style,
          stroke: isSelected ? "#3b82f6" : "#3b82f6",
          strokeWidth: isSelected ? 4 : 2,
          transition: "stroke 0.2s, stroke-width 0.2s",
        },
      };
    });

    set({ edges: styledEdges, isDirty: true });
  },

  deleteNode: (nodeId) => {
    set((state) => {
      const nextNodes = state.nodes.filter((n) => n.id !== nodeId);
      const nextEdges = state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId,
      );

      get().validateWorkflow(nextNodes, nextEdges);

      return {
        nodes: nextNodes,
        edges: nextEdges,
        isDirty: true,
        selectedNodeId:
          state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    });
  },

  deleteEdge: (edgeId) => {
    set((state) => ({
      isDirty: true,
      edges: state.edges.filter((e) => e.id !== edgeId),
    }));
  },

  deleteSelected: () => {
    const { nodes, edges, selectedNodeId } = get();

    const selectedNodeIds = new Set(
      nodes.filter((n) => n.selected).map((n) => n.id),
    );
    const selectedEdgeIds = new Set(
      edges.filter((e) => e.selected).map((e) => e.id),
    );
    const nextNodes = nodes.filter((n) => !selectedNodeIds.has(n.id));
    const nextEdges = edges.filter(
      (e) =>
        !selectedEdgeIds.has(e.id) &&
        !selectedNodeIds.has(e.source) &&
        !selectedNodeIds.has(e.target),
    );

    set({
      nodes: nextNodes,
      edges: nextEdges,
      isDirty: true,
      selectedNodeId: selectedNodeIds.has(selectedNodeId || "")
        ? null
        : selectedNodeId,
    });
  },

  onConnect: (connection) => {
    const { source, target } = connection;
    const { nodes, edges } = get();
    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);

    if (!sourceNode || !targetNode) return;

    const isValid = isValidConnection(
      sourceNode,
      targetNode,
      connection,
      edges,
    );

    if (isValid) {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      };
      const nextEdges = addEdge(newEdge, edges);
      get().validateWorkflow(nodes, nextEdges);
      set({ edges: nextEdges, isDirty: true });
    }
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodeConfig: (id, updates) => {
    set((state) => ({
      isDirty: true,
      nodes: state.nodes.map((node) => {
        if (node.id !== id) return node;
        const currentData = node.data as NodeConfig;
        return {
          ...node,
          data: {
            ...currentData,
            error: null,
            config: { ...currentData.config, ...updates },
          },
        };
      }),
    }));
  },

  getNodeConfig: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (node && node.data && (node.data as any).config) {
      return (node.data as any).config;
    }
    return null;
  },

  getSerializedWorkflow: () => {
    const { nodes, edges } = get();
    const workflowMetadata = useWorkflowStore.getState();
    const backendPayloadofNodes = transformToBackendFormat(nodes, edges);

    return {
      id: workflowMetadata.id,
      name: workflowMetadata.name,
      description: workflowMetadata.description,
      isActive: workflowMetadata.isActive,
      state: workflowMetadata.state,
      nodes: backendPayloadofNodes,
    };
  },
  pollWorkflow: async (id: string) => {
    const poll = async () => {
      try {
        const workflow = await getWorkflow(id);
        if (!workflow) return;
        useWorkflowStore.setState({ state: workflow.state });
        const { nodes: currentNodes, setNodes, setFlow } = get();
        const updatedNodes = currentNodes.map((node) => {
          const backendNode = workflow.nodes.find(
            (bn: any) => bn.id === node.id,
          );
          if (!backendNode) return node;

          return {
            ...node,
            data: {
              ...node.data,
              result: backendNode.result,
              status: backendNode.status,
              error: backendNode.error,
            },
          };
        });

        set({ nodes: updatedNodes });

        const isFinished = ["success", "failed", "completed"].includes(
          workflow.status,
        );

        if (!isFinished) {
          setTimeout(poll, 2000);
        } else {
          useWorkflowStore.setState({ state: workflow.status });
          toast.success(`Workflow ${workflow.status}`);
        }
      } catch (error) {}
    };

    poll();
  },

  executeWorkflow: async () => {
    const {
      nodes,
      edges,
      getSerializedWorkflow,
      validateWorkflow,
      isDirty,
      setNodes,
    } = get();

    if (!validateWorkflow(nodes, edges)) {
      useWorkflowStore.setState({ state: "Draft" });
      return;
    }

    const fullPayload = getSerializedWorkflow() as any;
    const validation = WorkflowPayloadSchema.safeParse(fullPayload);

    if (!validation.success) {
      const issues = validation.error.issues;
      const serializedNodes = fullPayload.nodes;
      const updatedNodes = nodes.map((node) => {
        const payloadIndex = serializedNodes.findIndex(
          (n: any) => n.id === node.id,
        );
        const issue = issues.find((i) => i.path[1] === payloadIndex);
        return {
          ...node,
          data: {
            ...node.data,
            error: issue ? issue.message : null,
          },
        };
      });

      setNodes(updatedNodes);
      toast.error(issues[0].message);
      useWorkflowStore.setState({ state: "Draft" });
      return;
    }

    const workflowExists = await getWorkflow(validation.data.id);
    if (!workflowExists) {
      await createWorkflowRequest(fullPayload);
      useWorkflowStore.setState({ isEditing: true });
    } else if (isDirty) {
      await updateWorkflowRequest(fullPayload);
      set({ isDirty: false });
    }
    useWorkflowStore.setState({ state: "Running" });
    toast.success("Workflow execution started");
    get().pollWorkflow(validation.data.id);
    await executeWorkflowRequest(validation.data.id);
  },

  saveWorkflow: async () => {
    const {
      nodes,
      edges,
      getSerializedWorkflow,
      validateWorkflow,
      isDirty,
      setNodes,
    } = get();

    if (!validateWorkflow(nodes, edges)) return;

    const fullPayload = getSerializedWorkflow() as any;
    const validation = WorkflowPayloadSchema.safeParse(fullPayload);

    if (!validation.success) {
      const issues = validation.error.issues;
      const serializedNodes = fullPayload.nodes;
      const updatedNodes = nodes.map((node) => {
        const payloadIndex = serializedNodes.findIndex(
          (n: any) => n.id === node.id,
        );
        const issue = issues.find((i) => i.path[1] === payloadIndex);
        return {
          ...node,
          data: {
            ...node.data,
            error: issue ? issue.message : null,
          },
        };
      });

      setNodes(updatedNodes);
      toast.error(issues[0].message);
      return;
    }

    const workflowExists = await getWorkflow(validation.data.id);
    if (!workflowExists) {
      await createWorkflowRequest(fullPayload);
      toast.success("Workflow  created");
      useWorkflowStore.setState({ isEditing: true });
    } else if (isDirty) {
      await updateWorkflowRequest(fullPayload);
      toast.success("Workflow  updated");
      set({ isDirty: false });
    }
    useWorkflowStore.setState({ state: "Draft" });
  },
}));
