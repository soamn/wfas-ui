"use client";
import { memo, useRef } from "react";
import { NodeKind } from "@/app/store/node/node.constants";
import { NodeConfig } from "@/app/store/node/node.schema";
import { useFlowStore } from "@/app/store/node/node.store";
import ManualApiMenu from "../menus/ManualApiMenu";
import SetMenu from "../menus/SetMenu";
import { PiMouseFill } from "react-icons/pi";
import DelayMenu from "../menus/DelayMenu";
import FilterMenu from "../menus/FilterMenu";
import ConditionMenu from "../menus/ConditionMenu";
import ActionMenu from "../menus/ActionMenu";
import ChatMenu from "../menus/ChatMenu";
import ExtractMenu from "../menus/ExtractMenu";
import FailMenu from "../menus/FailMenu";
import LoopMenu from "../menus/LoopMenu";
import SwitchMenu from "../menus/SwitchMenu";
import TransformMenu from "../menus/TransformMenu";
import WebhookMenu from "../menus/WebHookMenu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IoClose } from "react-icons/io5";
import { TriggerMenu } from "../menus/TriggerMenu";
import { ICON_MAP } from "@/app/store/node/node.icons";
import { useWorkflowStore } from "@/app/store/workflow/workflow.store";

interface SidebarProps {
  nodeId: string;
  onClose: () => void;
}

const MemoizedSetMenu = memo(SetMenu);
const MemoizedTriggerMenu = memo(TriggerMenu);
const MemoizedApiMenu = memo(ManualApiMenu);
const MemoizedDelayMenu = memo(DelayMenu);
const MemoizedFilterMenu = memo(FilterMenu);
const MemoizedConditionMenu = memo(ConditionMenu);
const MemoizedActionMenu = memo(ActionMenu);
const MemoizedChatMenu = memo(ChatMenu);
const MemoizedExtractMenu = memo(ExtractMenu);
const MemoizedFailMenu = memo(FailMenu);
const MemoizedLoopMenu = memo(LoopMenu);
const MemoizedSwitchMenu = memo(SwitchMenu);
const MemoizedTransformMenu = memo(TransformMenu);
const MemoizedWebHookMenu = memo(WebhookMenu);

export default function ConfigSidebar({ nodeId, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const node = useFlowStore((state) =>
    state.nodes.find((n) => n.id === nodeId),
  );

  useGSAP(
    () => {
      if (!sidebarRef.current) return;
      gsap.fromTo(
        sidebarRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    },
    { dependencies: [nodeId] },
  );

  if (!node) return <EmptyState onClose={onClose} />;

  const data = node.data as NodeConfig;
  const iconType = node.type || NodeKind["MANUAL_API"];
  const Icon = ICON_MAP[iconType];
  return (
    <div
      ref={sidebarRef}
      className="w-full h-full bg-white dark:bg-[#0C0C0C] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col text-zinc-900 dark:text-zinc-100"
    >
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
            {Icon && (
              <Icon className="text-blue-600 dark:text-blue-400" size={18} />
            )}
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-widest">
              {data.label}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              {node.id.split("-")[0]}...
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          <IoClose size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-6">
          <div className="menu-item-container" key={node.id}>
            {data.type === NodeKind.SET && <MemoizedSetMenu id={node.id} />}
            {data.type === NodeKind.TRIGGER && (
              <MemoizedTriggerMenu id={node.id} />
            )}
            {data.type === NodeKind.MANUAL_API && (
              <MemoizedApiMenu id={node.id} />
            )}
            {data.type === NodeKind.DELAY && <MemoizedDelayMenu id={node.id} />}
            {data.type === NodeKind.FILTER && (
              <MemoizedFilterMenu id={node.id} />
            )}
            {data.type === NodeKind.CONDITION && (
              <MemoizedConditionMenu id={node.id} />
            )}
            {data.type === NodeKind.ACTION && (
              <MemoizedActionMenu id={node.id} />
            )}
            {data.type === NodeKind.CHAT && <MemoizedChatMenu id={node.id} />}
            {data.type === NodeKind.EXTRACT && (
              <MemoizedExtractMenu id={node.id} />
            )}
            {data.type === NodeKind.FAIL && <MemoizedFailMenu id={node.id} />}
            {data.type === NodeKind.TRANSFORM && (
              <MemoizedTransformMenu id={node.id} />
            )}
            {data.type === NodeKind.LOOP && <MemoizedLoopMenu id={node.id} />}
            {data.type === NodeKind.SWITCH && (
              <MemoizedSwitchMenu id={node.id} />
            )}
            {data.type === NodeKind.WEBHOOK && (
              <MemoizedWebHookMenu id={node.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const EmptyState = ({ onClose }: { onClose: () => void }) => (
  <div className="w-full h-full bg-white dark:bg-[#0C0C0C] flex flex-col items-center justify-center relative text-zinc-900 dark:text-zinc-100">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
    >
      <IoClose size={20} />
    </button>
    <div className="text-center flex flex-col items-center gap-4">
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-full">
        <PiMouseFill className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">No node selected</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Select a node on the canvas to configure it
        </p>
      </div>
    </div>
  </div>
);
