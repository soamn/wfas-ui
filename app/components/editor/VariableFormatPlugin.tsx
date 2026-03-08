import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TextNode } from "lexical";
import { $createVariableNode, VariableNode } from "./VariableNode";
import { useFlowStore } from "@/app/store/node/node.store";
import { getNodeRef } from "@/app/utils/nodenaming";
export function VariableAutoFormatPlugin() {
  const [editor] = useLexicalComposerContext();
  const nodes = useFlowStore((state) => state.nodes);

  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode) => {
      if (textNode instanceof VariableNode || !textNode.isSimpleText()) return;
      const textContent = textNode.getTextContent();

      if (!textContent.includes("}}")) return;

      const variableRegex = /\{\{([a-zA-Z0-9_]+)\.(.+?)\}\}/;
      const match = textContent.match(variableRegex);

      if (match !== null) {
        const [fullMatch, label, path] = match;
        const startOffset = match.index!;
        const sourceNode = nodesRef.current.find(
          (n) => getNodeRef(n as any) === label,
        );

        if (sourceNode) {
          editor.update(() => {
            let targetNode = textNode;
            if (startOffset > 0) {
              [, targetNode] = textNode.splitText(startOffset);
            }
            if (targetNode.getTextContent().length > fullMatch.length) {
              targetNode.splitText(fullMatch.length);
            }

            const variableNode = $createVariableNode(
              sourceNode.id,
              label,
              path,
            );
            targetNode.replace(variableNode);
            variableNode.selectNext();
          });
        }
      }
    });
  }, [editor]);

  return null;
}
