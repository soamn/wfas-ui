export interface WorkflowUIState {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isEditing: boolean;
  state: "Scheduled" | "Draft" | "Inactive" | "Running" | "Completed";
  setWorkflowData: (data: Partial<WorkflowUIState>) => void;
  resetWorkflow: () => void;
}
