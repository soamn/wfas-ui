import TriggerNode from "@/app/components/nodes/TriggerNode";
import ManualAPINode from "@/app/components/nodes/ManualAPI";
import { NodeKind } from "./node.constants";
import SetNode from "@/app/components/nodes/SetNode";
import ActionNode from "@/app/components/nodes/ActionNode";
import FilterNode from "@/app/components/nodes/FilterNode";
import ChatNode from "@/app/components/nodes/ChatNode";
import TransformNode from "@/app/components/nodes/TransformNode";
import ExtractNode from "@/app/components/nodes/ExtractNode";
import ConditionNode from "@/app/components/nodes/ConditionNode";
import LoopNode from "@/app/components/nodes/LoopNode";
import SwitchNode from "../../components/nodes/SwitchNode";
import FailNode from "@/app/components/nodes/FailNode";
import DelayNode from "@/app/components/nodes/DelayNode";

import { NodeConfig } from "./node.schema";
import { ProviderEnum } from "../credential/credential.types";
import WebhookNode from "@/app/components/nodes/WebHookNode";

export const NodeRegistry: {
  [K in NodeKind]: {
    component: any;
    defaultData: Extract<NodeConfig, { type: K }>;
  };
} = {
  [NodeKind.TRIGGER]: {
    component: TriggerNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.TRIGGER,
      label: "Manual Trigger",
      config: { triggerType: "manual" },
    },
  },
  [NodeKind.WEBHOOK]: {
    component: WebhookNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.WEBHOOK,
      label: "Webhook Listener",
      config: { provider: ProviderEnum.Telegram, triggerMessage: "/trigger" },
    },
  },
  [NodeKind.ACTION]: {
    component: ActionNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.ACTION,
      label: "API Action",
      config: {
        provider: ProviderEnum.Telegram,
        body: { spreadsheetId: "", sheetName: "", message: [] },
      },
    },
  },
  [NodeKind.MANUAL_API]: {
    component: ManualAPINode,
    defaultData: {
      result: {
        response: {
          some: "data",
          number: 1,
        },
      },
      status: "idle",
      error: null,
      type: NodeKind.MANUAL_API,
      label: "Manual API",
      config: {
        apiEndpoint: "",
        method: "GET",
        retry: 1,
        timeout: 10000,
        body: [],
      },
    },
  },
  [NodeKind.SET]: {
    component: SetNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.SET,
      label: "Set Variables",
      config: {
        fields: [],
      },
    },
  },
  [NodeKind.FILTER]: {
    component: FilterNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.FILTER,
      label: "Data Filter",
      config: {
        fieldName: "",
        operator: "equals",
        valueType: "text",
        compareValue: "",
      },
    },
  },
  [NodeKind.DELAY]: {
    component: DelayNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.DELAY,
      label: "Delay",
      config: { hours: 0, minutes: 1, seconds: 30, milliseconds: 0 },
    },
  },
  [NodeKind.CHAT]: {
    component: ChatNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.CHAT,
      label: "Open Router ",
      config: {
        model: "",
        system: "",
        user: "",
        temperature: 0.7,
      },
    },
  },
  [NodeKind.TRANSFORM]: {
    component: TransformNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.TRANSFORM,
      label: "Transform Data",
      config: { transforms: [] },
    },
  },
  [NodeKind.EXTRACT]: {
    component: ExtractNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.EXTRACT,
      label: "Extract Variable",
      config: { extractedPaths: [] },
    },
  },
  [NodeKind.CONDITION]: {
    component: ConditionNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.CONDITION,
      label: "Conditional Branch",
      config: {
        fieldName: "",
        operator: "equals",
        valueType: "text",
        compareValue: "",
        trueNodeId: "",
        falseNodeId: "",
      },
    },
  },
  [NodeKind.LOOP]: {
    component: LoopNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.LOOP,
      label: "Loop Over Items",
      config: { loopOver: "", maxIterations: 100, iterateNodeId: "", nextNodeId: "" },
    },
  },
  [NodeKind.SWITCH]: {
    component: SwitchNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.SWITCH,
      label: "Switch Case",
      config: { cases: [], referencePath: "", showDefault: true, defaultNodeId: "" },
    },
  },
  [NodeKind.FAIL]: {
    component: FailNode,
    defaultData: {
      result: null,
      status: "idle",
      error: null,
      type: NodeKind.FAIL,
      label: "Terminate Flow",
      config: { errorMessage: "Workflow failed at this step." },
    },
  },
};

export const NodeType = Object.fromEntries(
  Object.entries(NodeRegistry).map(([key, value]) => [key, value.component]),
);
