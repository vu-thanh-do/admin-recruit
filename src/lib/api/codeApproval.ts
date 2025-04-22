import { CodeApproval, CodeApprovalResponse } from "@/types/code-approval"
import { apiClient } from "../react-query/apiClient"


export async function getCodeApproval(): Promise<CodeApprovalResponse> {
  const response = await apiClient.get('/codeApproval');
  return response.data;
}

export async function updateCodeApproval(id: string, data: Partial<CodeApproval>) {
  const response = await apiClient.put(`/codeApproval/update/${id}`, data);
  return response.data;
}