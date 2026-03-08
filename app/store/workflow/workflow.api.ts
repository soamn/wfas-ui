import axios from "axios";
import { config } from "@/app/config/config";
import { WorkflowPayload } from "../node/node.schema";

export const getAllWorkflows = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/workflow`,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getWorkflow = async (id: WorkflowPayload["id"]) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/workflow/${id}`,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {}
};

export const createWorkflowRequest = async (
  workflowPayload: WorkflowPayload,
) => {
  try {
    await axios({
      method: "POST",
      url: `${config.BACKEND_SERVER_URL}/api/workflow/create`,
      data: workflowPayload,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  } catch (error) {}
};

export const updateWorkflowRequest = async (
  workflowPayload: WorkflowPayload,
) => {
  try {
    await axios({
      method: "PUT",
      url: `${config.BACKEND_SERVER_URL}/api/workflow/update/${workflowPayload.id}`,
      data: workflowPayload,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  } catch (error) {}
};

export const getRecentExecutions = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/execution/`,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch workflow executions:", error);
    return null;
  }
};

export const getWorkflowExecutions = async (id: WorkflowPayload["id"]) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/execution/workflow/${id}`,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch workflow executions:", error);
    return null;
  }
};

export const getExecutionResult = async (id: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/execution/${id}`,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch execution result:", error);
    return null;
  }
};

export const executeWorkflowRequest = async (id: WorkflowPayload["id"]) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.BACKEND_SERVER_URL}/api/workflow/execute/${id}`,
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return null;
  }
};

export const deleteWorkflow = async (id: WorkflowPayload["id"]) => {
  try {
    await axios({
      method: "DELETE",
      url: `${config.BACKEND_SERVER_URL}/api/workflow/${id}`,
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Failed to delete workflow:", error);
    return false;
  }
};

export const deleteExecution = async (id: string) => {
  try {
    await axios({
      method: "DELETE",
      url: `${config.BACKEND_SERVER_URL}/api/execution/${id}`,
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Failed to delete execution:", error);
    return false;
  }
};
