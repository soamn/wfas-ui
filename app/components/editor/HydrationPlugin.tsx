"use client";
import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { $createVariableNode } from "./VariableNode";

export function HydrationPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  const isInitialHydrationDone = useRef(false);

  useEffect(() => {
    if (isInitialHydrationDone.current) return;

    if (typeof value !== "string") return;

    editor.update(() => {
      const root = $getRoot();

      if (root.getTextContentSize() > 0) return;
      isInitialHydrationDone.current = true;
      root.clear();
      const paragraph = $createParagraphNode();
      const parts = value.split(/({{.*?}})/g);

      parts.forEach((part) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const rawContent = part.slice(2, -2);
          const dotIndex = rawContent.indexOf(".");

          let nodeId = "unknown";
          let label = rawContent;
          let path = "value";

          if (dotIndex !== -1) {
            label = rawContent.substring(0, dotIndex);
            path = rawContent.substring(dotIndex + 1);
            nodeId = label;
          }

          paragraph.append($createVariableNode(nodeId, label, path));
        } else if (part !== "") {
          paragraph.append($createTextNode(part));
        }
      });

      root.append(paragraph);
      isInitialHydrationDone.current = true;
    });
  }, [editor]);

  return null;
}
