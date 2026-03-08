import {
  TextNode,
  EditorConfig,
  NodeKey,
  SerializedTextNode,
  Spread,
} from "lexical";
export type SerializedVariableNode = Spread<
  { nodeId: string; label: string; path: string; type: "variable" },
  SerializedTextNode
>;

export class VariableNode extends TextNode {
  __nodeId: string;
  __label: string;
  __path: string;

  constructor(nodeId: string, label: string, path: string, key?: NodeKey) {
    super(`{{${label}.${path}}}`, key);
    this.__nodeId = nodeId;
    this.__label = label;
    this.__path = path;
  }

  static getType(): string {
    return "variable";
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(
      node.__nodeId,
      node.__label,
      node.__path,
      node.__key,
    );
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className =
      "bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold text-[11px] border border-indigo-200 inline-block mx-0.5 select-none cursor-default";
    return dom;
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      nodeId: this.__nodeId,
      label: this.__label,
      path: this.__path,
      type: "variable",
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    return $createVariableNode(
      serializedNode.nodeId,
      serializedNode.label,
      serializedNode.path,
    );
  }
}

export const $createVariableNode = (
  nodeId: string,
  label: string,
  path: string,
) => new VariableNode(nodeId, label, path);
export const $isVariableNode = (node: any): node is VariableNode =>
  node instanceof VariableNode;
