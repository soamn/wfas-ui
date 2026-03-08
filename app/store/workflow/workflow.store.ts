import { create } from "zustand";
import { WorkflowUIState } from "./workflow.types";

export const useWorkflowStore = create<WorkflowUIState>((set) => ({
  id: crypto.randomUUID(),
  name: "Untitled Workflow",
  description: "A new automated process",
  isActive: true,
  isEditing: false,
  state: "Draft",
  setWorkflowData: (data) => set((state) => ({ ...state, ...data })),
  resetWorkflow: () =>
    set({
      id: crypto.randomUUID(),
      name: "Untitled Workflow",
      isActive: true,
      state: "Draft",
    }),
}));
