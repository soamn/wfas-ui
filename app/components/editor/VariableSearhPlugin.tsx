"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_LOW,
  TextNode,
  $createTextNode,
} from "lexical";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { $createVariableNode } from "./VariableNode";
import { PiLightningFill } from "react-icons/pi";

export default function VariableSearchPlugin({
  variables,
}: {
  variables: any[];
}) {
  const [editor] = useLexicalComposerContext();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [queryString, setQueryString] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = variables
    .filter((v) =>
      v.path.toLowerCase().includes((queryString || "").toLowerCase()),
    )
    .slice(0, 8);

  const onSelect = (variable: any) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const node = anchor.getNode();

        if (node instanceof TextNode) {
          const offset = anchor.offset;
          const text = node.getTextContent();
          const triggerIndex = text.lastIndexOf("{{", offset - 1);

          if (triggerIndex !== -1) {
            selection.setTextNodeRange(node, triggerIndex, node, offset);
            selection.removeText();
          }
        }

        const cleanPath = variable.path.startsWith(`${variable.label}.`)
          ? variable.path.replace(`${variable.label}.`, "")
          : variable.path;

        const variableNode = $createVariableNode(
          variable.nodeId,
          variable.label,
          cleanPath,
        );

        const textNode = $createTextNode(" ");
        selection.insertNodes([variableNode, textNode]);
        textNode.select();
      }
    });
    setQueryString(null);
  };
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor;
          const textContent = anchor.getNode().getTextContent();
          const textBeforeCursor = textContent.slice(0, anchor.offset);

          const match = textBeforeCursor.match(/{{([^}]*)$/);
          if (match) {
            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
              const range = domSelection.getRangeAt(0).cloneRange();
              const rect = range.getBoundingClientRect();

              // If rect is 0 (can happen in some Lexical versions),
              // we fallback to the parent element's position
              if (rect.top === 0 && rect.left === 0) {
                const element = editor.getRootElement();
                if (element) {
                  const rootRect = element.getBoundingClientRect();
                  setCoords({ top: rootRect.top, left: rootRect.left });
                }
              } else {
                setCoords({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                });
              }
              setQueryString(match[1]);
            }
          } else {
            setQueryString(null);
          }
        }
      });
    });
  }, [editor]);

  // Inside VariableSearchPlugin
  useEffect(() => {
    if (queryString === null) return;

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const { key } = event;

        // Handle Escape first to release focus
        if (key === "Escape") {
          event.preventDefault();
          setQueryString(null);
          return true;
        }

        if (filtered.length > 0) {
          if (key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((p) => (p + 1) % filtered.length);
            return true;
          }
          if (key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex(
              (p) => (p - 1 + filtered.length) % filtered.length,
            );
            return true;
          }
          if (key === "Enter" || key === "Tab") {
            event.preventDefault();
            onSelect(filtered[selectedIndex]);
            setQueryString(null);
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, queryString, filtered, selectedIndex]);

  if (queryString === null || !coords) return null;

  // DARK MODE IDE STYLING
  const menuContent = (
    <div
      className="fixed z-999 bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl w-64 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{
        top: coords.top + 10,
        left: Math.min(coords.left, window.innerWidth - 270),
      }}
    >
      <div className="p-2 px-3 text-[9px] font-black bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <span>Variables</span>
        <PiLightningFill className="text-blue-500" />
      </div>
      <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-400 italic">
            No matches...
          </div>
        ) : (
          filtered.map((v, i) => {
            const isActive = i === selectedIndex;
            return (
              <button
                key={`${v.nodeId}-${v.path}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(v)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex flex-col gap-0.5 border ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900 border-transparent text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold truncate">
                    {v.path.split(".").pop()}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1 rounded ${isActive ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
                  >
                    {v.label}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}
