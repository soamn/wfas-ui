import { Connection, Node, Edge } from "@xyflow/react";
import { NodeKind } from "../store/node/node.constants";
import toast from "react-hot-toast";

type NodeConnectionRules = {
  canBeSource: boolean;
  canBeTarget: boolean;
  maxIncomingTotal: number;
  maxOutgoingTotal: number;
  maxPerSourceHandle: number;
  maxPerTargetHandle: number;
};

const DEFAULT_RULES: NodeConnectionRules = {
  canBeSource: true,
  canBeTarget: true,
  maxIncomingTotal: 1,
  maxOutgoingTotal: 1,
  maxPerSourceHandle: 1,
  maxPerTargetHandle: 1,
};

const NODE_RULES: Record<string, NodeConnectionRules> = {
  [NodeKind.TRIGGER]: {
    ...DEFAULT_RULES,
    canBeTarget: false,
    maxIncomingTotal: 0,
  },
  [NodeKind.WEBHOOK]: {
    ...DEFAULT_RULES,
    canBeTarget: false,
    maxIncomingTotal: 0,
  },
  [NodeKind.CONDITION]: {
    ...DEFAULT_RULES,
    maxOutgoingTotal: 2,
  },
  [NodeKind.SWITCH]: {
    ...DEFAULT_RULES,
    maxOutgoingTotal: Infinity,
  },
  [NodeKind.FAIL]: {
    ...DEFAULT_RULES,
    canBeSource: false,
    maxOutgoingTotal: 0,
  },
  [NodeKind.ACTION]: { ...DEFAULT_RULES },
  [NodeKind.DELAY]: { ...DEFAULT_RULES },
  [NodeKind.TRANSFORM]: { ...DEFAULT_RULES },
  [NodeKind.SET]: { ...DEFAULT_RULES },
  [NodeKind.MANUAL_API]: { ...DEFAULT_RULES },
  [NodeKind.LOOP]: {
    ...DEFAULT_RULES,
    maxOutgoingTotal: 2,
    maxIncomingTotal: 2,
    maxPerSourceHandle: 1,
    maxPerTargetHandle: 2,
  },
};

export const CheckIfDAG = (nodes: any[], edges: Edge[]): boolean => {
  const adjacencyList = new Map<string, string[]>();
  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        if (hasCycle(neighborId)) return true;
      } else if (recStack.has(neighborId)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) return true;
    }
  }

  return false;
};
export function isValidConnection(
  sourceNode: Node,
  targetNode: Node,
  connection: Connection,
  edges: Edge[],
): boolean {
  const { source, target, sourceHandle, targetHandle } = connection;

  if (source === target) {
    toast.error("Self-connections are not allowed.");
    return false;
  }

  const isDuplicate = edges.some(
    (edge) =>
      edge.source === source &&
      edge.target === target &&
      edge.sourceHandle === sourceHandle &&
      edge.targetHandle === targetHandle,
  );
  if (isDuplicate) return false;

  const nodesAlreadyLinked = edges.some(
    (edge) =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source),
  );
  if (nodesAlreadyLinked) {
    toast.error("Only one path is allowed between these nodes.");
    return false;
  }

  const isSourceIn = sourceHandle?.toLowerCase().includes("in");
  const isTargetOut = targetHandle?.toLowerCase().includes("out");
  if (isSourceIn || isTargetOut) return false;

  const sourceRules = NODE_RULES[sourceNode.type as string] || DEFAULT_RULES;
  const targetRules = NODE_RULES[targetNode.type as string] || DEFAULT_RULES;

  if (!sourceRules.canBeSource) {
    toast.error(`${sourceNode.type} cannot have outgoing connections.`);
    return false;
  }
  if (!targetRules.canBeTarget) {
    toast.error(`${targetNode.type} cannot have incoming connections.`);
    return false;
  }

  const currentOutgoingFromSource = edges.filter((e) => e.source === source);
  const currentIncomingToTarget = edges.filter((e) => e.target === target);

  const currentOnSourceHandle = currentOutgoingFromSource.filter(
    (e) => e.sourceHandle === sourceHandle,
  );
  const currentOnTargetHandle = currentIncomingToTarget.filter(
    (e) => e.targetHandle === targetHandle,
  );

  if (currentOutgoingFromSource.length >= sourceRules.maxOutgoingTotal) {
    toast.error(`${sourceNode.type} has reached its maximum outgoing limits.`);
    return false;
  }
  if (currentOnSourceHandle.length >= sourceRules.maxPerSourceHandle) {
    toast.error("This specific output handle is already connected.");
    return false;
  }

  if (currentIncomingToTarget.length >= targetRules.maxIncomingTotal) {
    toast.error(`${targetNode.type} has reached its maximum incoming limits.`);
    return false;
  }
  if (currentOnTargetHandle.length >= targetRules.maxPerTargetHandle) {
    toast.error("This specific input handle already has a connection.");
    return false;
  }

  const prospectiveEdge = { source, target } as Edge;
  if (CheckIfDAG([sourceNode, targetNode], [...edges, prospectiveEdge])) {
    toast.error("Circular connections are not allowed.");
    return false;
  }

  return true;
}

export const transformToBackendFormat = (nodes: Node[], edges: Edge[]) => {
  const ENTRY_TYPES = ["TRIGGER", "WEBHOOK"];
  const triggerNode = nodes.find((n) => ENTRY_TYPES.includes(n.type!));
  if (!triggerNode) return [];

  const reachableNodes: Node[] = [];
  const visited = new Set<string>();
  const queue: string[] = [triggerNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;

    const node = nodes.find((n) => n.id === currentId);
    if (node) {
      reachableNodes.push(node);
      visited.add(currentId);
      const children = edges
        .filter((edge) => edge.source === currentId)
        .map((edge) => edge.target);
      queue.push(...children);
    }
  }

  if (reachableNodes.length <= 1) {
    return [];
  }

  const idToIndexMap = new Map(
    reachableNodes.map((node, index) => [node.id, index]),
  );

  return reachableNodes.map((node, index) => {
    const data = node.data as any;

    const outgoingIndices = edges
      .filter((edge) => edge.source === node.id)
      .map((edge) => idToIndexMap.get(edge.target))
      .filter((idx) => idx !== undefined) as number[];

    const nodeConnections = edges
      .filter((edge) => edge.source === node.id && visited.has(edge.target))
      .map((edge) => ({
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      }));

    return {
      id: node.id,
      label: data.label,
      type: node.type,
      position: node.position,
      index: index,
      config: data.config,
      outgoing: outgoingIndices,
      connections: nodeConnections,
    };
  });
};
