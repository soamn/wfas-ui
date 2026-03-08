export enum NodeKind {
  WEBHOOK = "WEBHOOK", //done
  ACTION = "ACTION", //done
  CHAT = "CHAT", //done
  TRIGGER = "TRIGGER", //done
  MANUAL_API = "MANUAL_API", //done
  SET = "SET", //done
  DELAY = "DELAY", //done
  FILTER = "FILTER", //done
  CONDITION = "CONDITION", //done
  TRANSFORM = "TRANSFORM", //done
  EXTRACT = "EXTRACT", //done
  LOOP = "LOOP", //done
  SWITCH = "SWITCH", //done
  FAIL = "FAIL", //done
}

export const WorkflowStateEnum = [
  "Scheduled",
  "Draft",
  "Inactive",
  "Running",
  "Completed",
] as const;
