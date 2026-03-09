import axios from "axios";
import { WorkflowPayload } from "../node/node.schema";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllWorkflows = async () => {
  try {
    const response = await api.get("/workflow");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getWorkflow = async (id: WorkflowPayload["id"]) => {
  try {
    const response = await api.get(`/workflow/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createWorkflowRequest = async (
  workflowPayload: WorkflowPayload,
) => {
  try {
    await api.post("/workflow/create", workflowPayload);
  } catch (error) {}
};

export const updateWorkflowRequest = async (
  workflowPayload: WorkflowPayload,
) => {
  try {
    await api.put(`/workflow/update/${workflowPayload.id}`, workflowPayload);
  } catch (error) {}
};

export const getRecentExecutions = async () => {
  try {
    const response = await api.get("/execution/");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getWorkflowExecutions = async (id: WorkflowPayload["id"]) => {
  try {
    const response = await api.get(`/execution/workflow/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getExecutionResult = async (id: string) => {
  try {
    const response = await api.get(`/execution/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const executeWorkflowRequest = async (id: WorkflowPayload["id"]) => {
  try {
    return await api.get(`/workflow/execute/${id}`);
  } catch (error) {
    return null;
  }
};

export const deleteWorkflow = async (id: WorkflowPayload["id"]) => {
  try {
    await api.delete(`/workflow/${id}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteExecution = async (id: string) => {
  try {
    await api.delete(`/execution/${id}`);
    return true;
  } catch (error) {
    return false;
  }
};
