export interface CodeApproval {
  _id: string;
  label: string;
  code: string;
  status: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface CodeApprovalResponse {
  status: number;
  message: string;
  data: CodeApproval[];
}