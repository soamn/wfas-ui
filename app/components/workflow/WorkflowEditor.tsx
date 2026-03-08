"use client";

import { useState } from "react";
import { Pane, SplitPane } from "react-split-pane";
import WorkflowCanvas from "./WorkflowCanvas";
import ConfigSidebar from "@/app/components/nodes/ui/ConfigSidebar";
import { ResultPanel } from "@/app/components/nodes/menus/ResultPanel";
import { CustomDivider } from "@/app/components/nodes/ui/Divider";
import { useFlowStore } from "@/app/store/node/node.store";
import { useWorkflowShortcuts } from "@/app/hooks/useWorkflowEvents";

export default function WorkflowEditor() {
  const store = useFlowStore();
  const [showResultTab, setShowResultTab] = useState(false);
  const [showConfigTab, setShowConfigTab] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(800);
  const isSidebarOpen = showConfigTab || showResultTab;

  useWorkflowShortcuts({
    onOpenConfigTab: setShowConfigTab,
    onOpenResultTab: setShowResultTab,
  });

  return (
    <div className="w-full h-screen absolute inset-0 overflow-hidden">
      <SplitPane
        direction="horizontal"
        divider={CustomDivider}
        resizable={isSidebarOpen}
        onResize={(sizes) => {
          if (sizes.length > 1) {
            setSidebarWidth(sizes[1]);
          }
        }}
      >
        <Pane className="h-full bg-white dark:bg-[#0C0C0C] min-w-0">
          <WorkflowCanvas
            showConfigTab={showConfigTab}
            setShowConfigTab={setShowConfigTab}
            showResultTab={showResultTab}
            setShowResultTab={setShowResultTab}
            isSidebarOpen={isSidebarOpen}
          />
        </Pane>

        <Pane
          size={isSidebarOpen ? sidebarWidth : 0}
          minSize={0}
          maxSize={isSidebarOpen ? "90%" : 0}
          className={`h-full border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0C0C0C] shadow-xl
            ${!isSidebarOpen ? "overflow-hidden border-none" : "flex flex-col"}
          `}
        >
          {isSidebarOpen && (
            <div className="h-full flex flex-col">
              {showResultTab && showConfigTab ? (
                <SplitPane direction="horizontal" divider={CustomDivider}>
                  <Pane minSize="20px">
                    <ResultPanel
                      onClose={() => setShowResultTab(false)}
                      nodeId={store.selectedNodeId ?? ""}
                    />
                  </Pane>
                  <Pane minSize="400px">
                    <ConfigSidebar
                      nodeId={store.selectedNodeId ?? ""}
                      onClose={() => setShowConfigTab(false)}
                    />
                  </Pane>
                </SplitPane>
              ) : showResultTab ? (
                <ResultPanel
                  onClose={() => setShowResultTab(false)}
                  nodeId={store.selectedNodeId ?? ""}
                />
              ) : (
                <ConfigSidebar
                  nodeId={store.selectedNodeId ?? ""}
                  onClose={() => setShowConfigTab(false)}
                />
              )}
            </div>
          )}
        </Pane>
      </SplitPane>
    </div>
  );
}
