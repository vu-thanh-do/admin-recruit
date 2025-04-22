import { FormResponse } from "@/types/form";
import { apiClient } from "../react-query/apiClient"


export async function getForm(): Promise<FormResponse> {
  const response = await apiClient.get('/formTemplate');
  return response.data;
}