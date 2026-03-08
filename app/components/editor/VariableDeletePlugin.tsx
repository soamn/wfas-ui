import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_BACKSPACE_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $isVariableNode } from "./VariableNode";

export function VariableDeletePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor;

          // Look at the node immediately before the cursor
          const nodes = anchor.getNode().getPreviousSiblings();
          const prevNode =
            nodes[nodes.length - 1] || anchor.getNode().getPreviousSibling();

          // If the previous node is one of our Variables, remove it entirely
          if ($isVariableNode(prevNode)) {
            event.preventDefault(); // Stop default backspace
            prevNode.remove(); // Delete the whole pill
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
