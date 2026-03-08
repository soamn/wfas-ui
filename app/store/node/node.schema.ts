import z from "zod";
import { NodeKind, WorkflowStateEnum } from "./node.constants";
import { ProviderEnum } from "../credential/credential.types";

export const SetConfigSchema = z.object({
  fields: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        type: z.enum(["string", "number", "boolean"]),
        value: z.any().refine((val) => {
          if (typeof val === "string") {
            return val.trim().length > 0;
          }
          return val !== undefined && val !== null;
        }, "Value cannot be empty"),
      }),
    )
    .nonempty("Variable needs to be set"),
});

export const TriggerConfigSchema = z.object({
  triggerType: z.enum(["manual", "schedule"]),
  cronExpression: z.string().optional(),
});

export const WebhookConfigSchema = z.object({
  provider: z.enum(ProviderEnum, "A Provider must be selected"),
  triggerMessage: z.string().optional(),
});

export const ActionConfigSchema = z.object({
  provider: z.enum(ProviderEnum, "A Provider must be Selected"),
  body: z
    .object({
      message: z.any().superRefine((val, ctx) => {
        if (typeof val === "string") {
          if (val.trim().length === 0) {
            ctx.addIssue({
              code: "custom",
              message: "Message cannot be empty",
            });
          }
          return;
        }

        if (typeof val === "object" && val !== null) {
          const keys = Object.keys(val);
          if (keys.length === 0) {
            ctx.addIssue({
              code: "custom",
              message: "At least one field is required",
            });
            return;
          }

          const hasEmptyField = keys.some((k) => {
            const v = val[k];
            return typeof v === "string"
              ? v.trim().length === 0
              : v === null || v === undefined;
          });

          if (hasEmptyField) {
            ctx.addIssue({
              code: "custom",
              message: "All fields must be filled out",
            });
          }
          return;
        }

        ctx.addIssue({
          code: "custom",
          message: "Valid message data is required",
        });
      }),
      spreadsheetId: z.string().optional(),
      sheetName: z.string().optional(),
    })
    .catchall(z.any()),
});

const templateRegex = /\{\{.*?\}\}/;
export const ManualApiConfigSchema = z.object({
  apiEndpoint: z.string().refine((value) => {
    if (templateRegex.test(value)) return true;
    return z.url().safeParse(value).success;
  }, "Must be valid URL or variable reference"),
  method: z.enum(["POST", "GET"]),
  retry: z.number().min(0).max(5).default(3),
  timeout: z.number().min(100).max(30000).default(5000),
  body: z.json().nullable(),
});
export const FilterConfigSchema = z
  .object({
    fieldName: z.string().min(1, "Target property is required"),
    operator: z.enum([
      "equals",
      "not_equals",
      "contains",
      "starts_with",
      "greater_than",
      "less_than",
      "exists",
    ]),
    valueType: z.enum(["text", "number", "boolean"]),
    compareValue: z.any(),
  })
  .superRefine((data, ctx) => {
    if (data.operator === "exists") return;
    if (data.valueType === "text") {
      if (
        typeof data.compareValue !== "string" ||
        data.compareValue.trim() === ""
      ) {
        ctx.addIssue("Text can not be empty");
      }
    } else if (data.valueType === "number") {
      if (typeof data.compareValue !== "number" || isNaN(data.compareValue)) {
        ctx.addIssue({
          code: "custom",
          message: "Must be a valid number",
          path: ["compareValue"],
        });
      }
    } else if (data.valueType === "boolean") {
      if (data.compareValue !== true && data.compareValue !== false) {
        ctx.addIssue({
          code: "custom",
          message: "Must select true or false",
          path: ["compareValue"],
        });
      }
    }
  });

export const DelayConfigSchema = z
  .object({
    hours: z.number().min(0).max(1).default(0),
    minutes: z.number().min(0).max(59).default(0),
    seconds: z.number().min(0).max(59).default(0),
    milliseconds: z.number().min(0).max(1000).default(0),
  })
  .refine(
    (data) => {
      const totalMs =
        data.hours * 3600000 +
        data.minutes * 60000 +
        data.seconds * 1000 +
        data.milliseconds;
      const oneSecond = 1000;
      const oneHour = 3600000;

      return totalMs >= oneSecond && totalMs <= oneHour;
    },
    {
      message: "Delay must be between 1 second and 1 hour",
      path: ["seconds"],
    },
  );

export const ChatConfigSchema = z.object({
  model: z.string().min(1, "Model selection is required"),
  system: z.string().optional(),
  user: z.string().min(1, "User prompt is required"),
  temperature: z.number().min(0).max(2).default(0.7),
});
export const TransformConfigSchema = z.object({
  transforms: z
    .array(
      z.object({
        originalPath: z.string(),
        changedKey: z.string().min(1, "Key name is required"),
        changedValue: z.string(),
      }),
    )
    .default([]),
});

export const ExtractConfigSchema = z.object({
  extractedPaths: z.array(z.string()).default([]),
});

export const ConditionConfigSchema = z
  .object({
    fieldName: z.string().min(1, "Target property is required"),
    operator: z.enum([
      "equals",
      "not_equals",
      "contains",
      "starts_with",
      "greater_than",
      "less_than",
      "exists",
    ]),
    valueType: z.enum(["text", "number", "boolean"]),
    compareValue: z.any(),
    trueNodeId: z.string().min(1, "True path connection required"),
    falseNodeId: z.string().min(1, "False path connection required"),
  })
  .superRefine((data, ctx) => {
    if (data.operator === "exists") return;
    if (data.valueType === "text") {
      if (
        typeof data.compareValue !== "string" ||
        data.compareValue.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Text cannot be empty",
          path: ["compareValue"],
        });
      }
    } else if (data.valueType === "number") {
      if (typeof data.compareValue !== "number" || isNaN(data.compareValue)) {
        ctx.addIssue({
          code: "custom",
          message: "Must be a valid number",
          path: ["compareValue"],
        });
      }
    } else if (data.valueType === "boolean") {
      if (data.compareValue !== true && data.compareValue !== false) {
        ctx.addIssue({
          code: "custom",
          message: "Must select true or false",
          path: ["compareValue"],
        });
      }
    }
  });

export const LoopConfigSchema = z.object({
  loopOver: z.string().min(1, "Please select an array variable"),
  maxIterations: z
    .number()
    .positive()
    .min(1)
    .max(100, "Max iterations should be less than 100 "),
  iterateNodeId: z.string().min(1, "Iteration branch must be connected"),
  nextNodeId: z.string().min(1, "Completion path must be connected"),
});

export const SwitchCaseSchema = z
  .object({
    id: z.string(),
    operator: z.string().min(1, "Operator is required"),
    valueType: z.enum(["text", "number", "boolean"]),
    compareValue: z.any(),
    targetNodeId: z.string().min(1, "Connection required"),
  })
  .superRefine((data, ctx) => {
    const { valueType, compareValue, operator } = data;

    if (operator === "exists") return;

    if (valueType === "number") {
      if (typeof compareValue !== "number" || isNaN(compareValue)) {
        ctx.addIssue({
          code: "custom",
          message: "Must be a valid number",
          path: ["compareValue"],
        });
      }
    }

    if (valueType === "boolean") {
      if (typeof compareValue !== "boolean") {
        ctx.addIssue({
          code: "custom",
          message: "Must be true or false",
          path: ["compareValue"],
        });
      }
    }

    if (valueType === "text") {
      if (typeof compareValue !== "string" || compareValue.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Text value cannot be empty",
          path: ["compareValue"],
        });
      }
    }

    const numberOps = ["greater_than", "less_than"];
    const textOps = ["contains", "starts_with"];

    if (valueType === "number" && textOps.includes(operator)) {
      ctx.addIssue({
        code: "custom",
        message: "Operator not supported for numbers",
        path: ["operator"],
      });
    }

    if (
      valueType === "boolean" &&
      (numberOps.includes(operator) || textOps.includes(operator))
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Booleans only support Equals/Not Equals",
        path: ["operator"],
      });
    }
  });

export const SwitchConfigSchema = z
  .object({
    referencePath: z.string().min(1, "Variable selection required"),
    cases: z.array(SwitchCaseSchema).default([]),
    showDefault: z.boolean().default(true),
    defaultNodeId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    data.cases.forEach((c, index) => {
      if (!c.targetNodeId || c.targetNodeId === "") {
        ctx.addIssue({
          code: "custom",
          message: `Path ${index + 1} requires an edge connection`,
          path: ["cases", index, "targetNodeId"],
        });
      }
    });

    if (
      data.showDefault &&
      (!data.defaultNodeId || data.defaultNodeId === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Connect the 'Default' output",
        path: ["defaultNodeId"],
      });
    }
  });

export const FailConfigSchema = z.object({
  errorMessage: z.string().default("Workflow stopped at this step."),
});

const NodeBase = z.object({
  label: z.string(),
  result: z.any().nullable().default(null),
  status: z.enum(["idle", "running", "success", "failed"]).default("idle"),
  error: z.string().nullable().default(null),
});

export const NodeWithConfigSchema = z.discriminatedUnion("type", [
  NodeBase.extend({
    type: z.literal(NodeKind.TRIGGER),
    config: TriggerConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.SET),
    config: SetConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.WEBHOOK),
    config: WebhookConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.ACTION),
    config: ActionConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.MANUAL_API),
    config: ManualApiConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.FILTER),
    config: FilterConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.DELAY),
    config: DelayConfigSchema,
  }),
  NodeBase.extend({ type: z.literal(NodeKind.CHAT), config: ChatConfigSchema }),
  NodeBase.extend({
    type: z.literal(NodeKind.TRANSFORM),
    config: TransformConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.EXTRACT),
    config: ExtractConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.CONDITION),
    config: ConditionConfigSchema,
  }),
  NodeBase.extend({ type: z.literal(NodeKind.LOOP), config: LoopConfigSchema }),
  NodeBase.extend({
    type: z.literal(NodeKind.SWITCH),
    config: SwitchConfigSchema,
  }),
  NodeBase.extend({
    type: z.literal(NodeKind.FAIL),
    config: FailConfigSchema,
  }),
]);

export type NodeConfig = z.infer<typeof NodeWithConfigSchema>;
export interface NodeDataProps<T extends NodeKind> {
  data: Extract<NodeConfig, { type: T }>;
}
export const WorkflowPayloadSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  isActive: z.boolean(),
  state: z.enum(WorkflowStateEnum),
  nodes: z.array(NodeWithConfigSchema),
});
export const WorkflowNodePayloadSchema = z.object({
  id: z.uuid(),
  type: z.enum(NodeKind),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  index: z.number(),
  connections: z.object({
    sourceNodeId: z.string(),
    targetNodeId: z.string(),
    sourceHandle: z.string().nullish(),
    targetHandle: z.string().nullish(),
  }),
  outgoing: z.array(z.number()),
  data: NodeWithConfigSchema,
});

export type WorkflowPayload = z.infer<typeof WorkflowPayloadSchema>;
