"use client";
import { useEffect, useRef } from "react";
import { Node } from "@xyflow/react";
import toast from "react-hot-toast";

export function useWorkflowShortcuts({
  onOpenSearch = () => {},
  onDelete = () => {},
  onOpenSettings = () => {},
  onOpenConfigTab = () => {},
  onSaveWorkflow = () => {},
  onOpenResultTab = () => {},
  nodes = [],
  setNodes = () => {},
  selectedNodeId,
}: any) {
  const clipboard = useRef<Node | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable;

      if (isInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch?.({ x: window.innerWidth / 2 - 200, y: 150 });
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        onDelete();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        const selectedNode = nodes.find((n: Node) => n.id === selectedNodeId);
        if (selectedNode) {
          clipboard.current = selectedNode;
          toast.success(`Copied ${selectedNode.data?.label || "node"}`, {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              fontSize: "12px",
            },
          });
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        if (clipboard.current) {
          const { icon, ...otherData } = clipboard.current.data;
          const freshConfigData = JSON.parse(JSON.stringify(otherData));

          const newNode: Node = {
            ...clipboard.current,
            id: crypto.randomUUID(),
            position: {
              x: clipboard.current.position.x + 40,
              y: clipboard.current.position.y + 40,
            },
            data: {
              ...freshConfigData,
              icon: icon,
            },
            selected: true,
          };

          setNodes([
            ...nodes.map((n: Node) => ({ ...n, selected: false })),
            newNode,
          ]);

          toast.success("Node pasted", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              fontSize: "12px",
            },
          });
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        onOpenSettings?.((prev: boolean) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        onOpenConfigTab?.((prev: boolean) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSaveWorkflow?.((prev: boolean) => !prev);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        onOpenResultTab?.((prev: boolean) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onDelete,
    nodes,
    selectedNodeId,
    setNodes,
    onOpenSearch,
    onOpenSettings,
    onOpenConfigTab,
    onSaveWorkflow,
    onOpenResultTab,
  ]);
}
