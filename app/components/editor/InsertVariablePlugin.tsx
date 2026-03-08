"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $createTextNode } from "lexical";
import { $createVariableNode } from "./VariableNode";
import { PiPlusBold, PiLightningFill } from "react-icons/pi";

interface Variable {
  nodeId: string;
  label: string;
  path: string;
  value: any;
}

interface InsertVariablePluginProps {
  variables: Variable[];
}

export default function InsertVariablePlugin({
  variables,
}: InsertVariablePluginProps) {
  const [editor] = useLexicalComposerContext();

  const handleInsert = (v: Variable) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const cleanPath = v.path.startsWith(`${v.label}.`)
          ? v.path.replace(`${v.label}.`, "")
          : v.path;
        const variableNode = $createVariableNode(v.nodeId, v.label, cleanPath);

        selection.insertNodes([variableNode, $createTextNode(" ")]);
      }
    });
  };
  const filteredVariables = variables.filter((v) => !v.path.includes("["));

  // EMPTY STATE
  if (!filteredVariables || filteredVariables.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
        <PiLightningFill
          className="text-zinc-300 dark:text-zinc-700"
          size={12}
        />
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
          Run nodes to generate variables
        </span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5 items-center max-h-40 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-1 mr-1">
        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Quick Add
        </span>
      </div>

      {filteredVariables.slice(0, 12).map((v) => (
        <button
          key={`${v.nodeId}-${v.path}`}
          type="button"
          onClick={() => handleInsert(v)}
          className="group flex items-center gap-2 text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pl-1.5 pr-2.5 py-1 rounded-lg shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-medium text-zinc-700 dark:text-zinc-300 active:scale-95"
        >
          <PiPlusBold
            className="text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            size={10}
          />

          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono uppercase tracking-tighter bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 px-1 rounded-sm group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              {v.label.substring(0, 6)}
            </span>

            <span className="truncate max-w-20 group-hover:text-indigo-700 dark:group-hover:text-indigo-200 transition-colors">
              {v.path.split(".").pop()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
