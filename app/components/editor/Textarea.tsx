"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { VariableNode } from "./VariableNode";
import VariableSearchPlugin from "./VariableSearhPlugin";
import InsertVariablePlugin from "./InsertVariablePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { VariableDeletePlugin } from "./VariableDeletePlugin";
import { HydrationPlugin } from "./HydrationPlugin";
import { VariableAutoFormatPlugin } from "./VariableFormatPlugin";
import { useUpstreamData } from "@/app/hooks/useUpstreamData";

interface TextareaProps {
  variables: any[];
  value?: string;
  onChange: (text: string) => void;
  placeholder?: string;
  showVariables?: boolean;
}

export default function Textarea({
  variables,
  onChange,
  placeholder,
  value,
  showVariables = true,
}: TextareaProps) {
  const initialConfig = {
    namespace: "VariableEditor",
    nodes: [VariableNode],
    onError: (error: Error) => {},
    theme: {
      text: {
        base: "text-sm leading-relaxed text-zinc-900 dark:text-zinc-100",
      },
      variable:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded px-1 font-mono",
    },
  };
  return (
    <div className="group border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-24 p-4 outline-none selection:bg-blue-500/30 dark:text-zinc-100 font-sans text-sm" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-zinc-400 dark:text-zinc-600 text-sm pointer-events-none italic">
                {placeholder || "Start typing, use {{ for variables..."}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <VariableAutoFormatPlugin />
          <HydrationPlugin value={value || ""} />
          <VariableSearchPlugin variables={variables} />
          <VariableDeletePlugin />

          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const root = $getRoot();
                const plainText = root.getTextContent();
                onChange(plainText);
              });
            }}
          />
        </div>

        {/* <HistoryPlugin /> */}
        {showVariables && <InsertVariablePlugin variables={variables} />}
      </LexicalComposer>
    </div>
  );
}
