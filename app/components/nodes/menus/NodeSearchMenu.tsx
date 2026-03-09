"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { NodeConfig } from "@/app/store/node/node.schema";
import { useFlowStore } from "@/app/store/node/node.store";
import { NodeRegistry } from "@/app/store/node/node.registry";
import { NodeKind } from "@/app/store/node/node.constants";
import { ICON_MAP } from "@/app/store/node/node.icons";

interface SearchMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
}

export default function SearchMenu({ position, onClose }: SearchMenuProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { screenToFlowPosition } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const store = useFlowStore();

  const filteredOptions = useMemo(() => {
    const entries = Object.entries(NodeRegistry) as [
      NodeKind,
      { component: any; defaultData: NodeConfig },
    ][];

    const results = entries.filter(
      ([kind, nodeInfo]) =>
        kind.toLowerCase().includes(search.toLowerCase()) ||
        nodeInfo.defaultData.label.toLowerCase().includes(search.toLowerCase()),
    );

    setActiveIndex(0);
    return results;
  }, [search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = (type: NodeKind) => {
    const flowPos = screenToFlowPosition({
      x: position.x + 20,
      y: position.y + 20,
    });
    const newNode = {
      id: crypto.randomUUID(),
      type,
      position: flowPos,
      data: {
        ...NodeRegistry[type].defaultData,
      },
    };

    store.setNodes([...store.nodes, newNode]);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex][0]);
      }
    }
  };

  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleGlobalEsc);
    return () => window.removeEventListener("keydown", handleGlobalEsc);
  }, [onClose]);

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.children[
      activeIndex
    ] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div
      className="fixed bg-white dark:bg-[#121212] shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 z-100 w-72 flex flex-col gap-1 outline-none animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.y, left: position.x }}
      onKeyDown={handleKeyDown}
      onMouseLeave={onClose}
    >
      <div className="px-1 pt-1 pb-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search actions..."
          className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="max-h-80 overflow-y-auto custom-scrollbar flex flex-col gap-0.5 p-0.5"
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map(([kind, nodeInfo], index) => {
            const { label, type } = nodeInfo.defaultData;
            const Icon = ICON_MAP[type];
            const isActive = index === activeIndex;

            return (
              <button
                key={kind}
                onClick={() => handleSelect(kind)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group border ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30"
                    : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-semibold text-xs leading-none mb-1 transition-colors ${
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider ${
                      isActive
                        ? "text-blue-400 dark:text-blue-500/60"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {kind}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="py-8 text-center text-zinc-400 dark:text-zinc-600 text-xs italic">
            No matching nodes
          </div>
        )}
      </div>

      {/* Footer shortcut hints */}
      <div className="mt-1 px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-medium">
          Navigate
        </span>
        <div className="flex gap-1">
          <kbd className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-500 font-sans">
            ↑↓
          </kbd>
          <kbd className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-500 font-sans">
            Enter
          </kbd>
        </div>
      </div>
    </div>
  );
}
