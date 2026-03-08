"use client";

import { useCallback, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowStore } from "@/app/store/node/node.store";
import SearchMenu from "@/app/components/nodes/menus/NodeSearchMenu";
import WorkflowSettings from "@/app/components/nodes/menus/WorkflowSettings";
import { useWorkflowShortcuts } from "@/app/hooks/useWorkflowEvents";
import { useTheme } from "@/app/provider/theme-provider";
import { MdSettings, MdPlayArrow, MdSchedule } from "react-icons/md";
import { FaStopCircle } from "react-icons/fa";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";
import { NodeType } from "@/app/store/node/node.registry";
import { BiPencil } from "react-icons/bi";
import toast from "react-hot-toast";

interface Props {
  showConfigTab: boolean;
  setShowConfigTab: (v: boolean) => void;
  showResultTab: boolean;
  setShowResultTab: (v: boolean) => void;
  isSidebarOpen: boolean;
}

export default function WorkflowCanvas({
  showConfigTab,
  setShowConfigTab,
  showResultTab,
  setShowResultTab,
  isSidebarOpen,
}: Props) {
  const store = useFlowStore();
  const { theme } = useTheme();
  const { setWorkflowData, name, state, id } = useWorkflowStore();

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [showWorkflowSettings, setShowWorkflowSettings] = useState(false);
  useWorkflowShortcuts({
    onOpenSearch: setMenuPos,
    onDelete: store.deleteSelected,
    nodes: store.nodes,
    setNodes: store.setNodes,
    selectedNodeId: store.selectedNodeId,
    onOpenSettings: setShowWorkflowSettings,
    onSaveWorkflow: () => {
      store.saveWorkflow();
    },
  });

  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      store.setSelectedNode(node.id);
      setShowConfigTab(true);
    },
    [store],
  );

  const onConnectEnd = useCallback((event: any, connectionState: any) => {
    if (!connectionState.isValid) {
      const { clientX, clientY } =
        event instanceof MouseEvent ? event : event.touches[0];
      setMenuPos({ x: clientX, y: clientY });
    }
  }, []);

  return (
    <div
      className="relative w-full h-full"
      style={{
        width: isSidebarOpen ? "100%" : "99.99dvw",
        height: "100%",
      }}
    >
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        nodeTypes={NodeType}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={store.onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={() => store.setSelectedNode(null)}
        onNodesDelete={(deleted) =>
          deleted.forEach((n) => store.deleteNode(n.id))
        }
        connectionMode={ConnectionMode.Loose}
        onlyRenderVisibleElements
      >
        <Controls showInteractive className=" text-zinc-800 " />
        <Panel position="top-left" className="text-black dark:text-white ">
          <div className="flex items-center space-x-1 ">
            <label htmlFor="workflow-name">
              <BiPencil />{" "}
            </label>
            <input
              defaultValue={name || id}
              onChange={(e) => setWorkflowData({ name: e.target.value })}
              className=" outline-0 bg-transparent max-w-38 overflow-scroll focus:underline"
            />
          </div>
        </Panel>

        <Panel position="top-right">
          <button onClick={() => setShowWorkflowSettings(true)}>
            <MdSettings className="w-6 h-6 hover:text-gray-800 dark:text-white dark:hover:text-zinc-200" />
          </button>
        </Panel>

        <Panel position="bottom-center" className="pb-20">
          <button
            onClick={() => {
              if (state === "Running") {
                toast("workflow is running");
                return;
              }

              if (state === "Scheduled") {
                toast("workflow already scheduled");
                return;
              }
              setWorkflowData({ state: "Running" });
              store.executeWorkflow();
            }}
            className={`p-2 rounded flex flex-col items-center min-w-20 transition-all ${
              state === "Running"
                ? "bg-blue-800"
                : state === "Scheduled"
                  ? "bg-amber-500"
                  : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {state === "Running" ? (
              <>
                <FaStopCircle className="animate-spin" />
                <span className="text-[10px]">Executing</span>
              </>
            ) : state === "Scheduled" ? (
              <>
                <MdSchedule />
                <span className="text-[10px]">Scheduled</span>
              </>
            ) : (
              <>
                <MdPlayArrow />
                <span className="text-[10px]">Execute</span>
              </>
            )}
          </button>
        </Panel>

        <Background
          bgColor={theme === "dark" ? "#0C0C0C" : "white"}
          color={theme === "dark" ? "white" : "black"}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>

      {menuPos && (
        <SearchMenu position={menuPos} onClose={() => setMenuPos(null)} />
      )}

      {showWorkflowSettings && (
        <WorkflowSettings
          onClose={() => setShowWorkflowSettings(false)}
          showConfig={showConfigTab}
          setShowConfig={setShowConfigTab}
          showResult={showResultTab}
          setShowResult={setShowResultTab}
        />
      )}
    </div>
  );
}
