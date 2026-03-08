"use client";
import { useFlowStore } from "@/app/store/node/node.store";
import { getNodeRef } from "../utils/nodenaming";
import { Node } from "@xyflow/react";
import { NodeConfig } from "../store/node/node.schema";

export function useUpstreamData(nodeId: string) {
  const nodes = useFlowStore((state) => state.nodes) as Node<NodeConfig>[];
  const edges = useFlowStore((state) => state.edges);

  const getAncestors = (
    targetId: string,
    visited = new Set<string>(),
  ): string[] => {
    const upstream = edges
      .filter((e) => e.target === targetId)
      .map((e) => e.source);

    upstream.forEach((sourceId) => {
      if (!visited.has(sourceId)) {
        visited.add(sourceId);
        getAncestors(sourceId, visited);
      }
    });
    return Array.from(visited);
  };

  function jsonToPath(
    obj: any,
    nodeId: string,
    alias: string,
    currentPath = "",
  ) {
    const results: any[] = [];
    if (typeof obj !== "object" || obj === null) return results;

    Object.entries(obj).forEach(([key, value]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : `${alias}.${key}`;
      let detectedType: string = typeof value;
      if (Array.isArray(value)) detectedType = "array";
      if (value === null) detectedType = "null";

      results.push({
        nodeId: nodeId,
        label: alias,
        path: newPath,
        value: value,
        type: detectedType,
      });

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        results.push(...jsonToPath(value, nodeId, alias, newPath));
      }
    });
    return results;
  }

  // --- LOGIC FOR IMMEDIATE PARENTS ---
  const immediateIncomingEdges = edges.filter((e) => e.target === nodeId);
  const parentNodes = immediateIncomingEdges
    .map((edge) => nodes.find((n) => n.id === edge.source))
    .filter((n): n is Node<NodeConfig> => !!n && !!n.data)
    .map((node) => ({ ...node, alias: getNodeRef(node) }));

  const parentResults = parentNodes.reduce(
    (acc, node) => {
      const result = node.data.result;
      if (result) acc[node.alias] = result;
      return acc;
    },
    {} as Record<string, any>,
  );

  const availableVariables = parentNodes.flatMap((node) => {
    const alias = node.alias || node.type || node.id;
    const result = parentResults[alias];
    return result ? jsonToPath(result, nodeId, alias) : [];
  });

  // --- LOGIC FOR ALL ANCESTORS (FOR SEARCH) ---
  const ancestorIds = getAncestors(nodeId);
  const allUpstreamNodes = ancestorIds
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is Node<NodeConfig> => !!n && !!n.data)
    .map((node) => ({ ...node, alias: getNodeRef(node) }));

  const allAvailableVariables = allUpstreamNodes.flatMap((node) => {
    const alias = node.alias || node.type || node.id;
    const result = node.data.result;
    return result ? jsonToPath(result, node.id, alias) : [];
  });

  return {
    availableVariables,
    allAvailableVariables,
    parentResults,
    parentNodes,
    allUpstreamNodes,
  };
}
