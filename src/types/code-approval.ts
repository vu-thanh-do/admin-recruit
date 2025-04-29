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
export interface ISpecificCodeApprove {
  employeeCode: string;
  employeeName: string;
  employeeEmail: string;
}
export interface IExcludeCodeApprove {
  employeeCode: string;
}
export interface ICodeApproval {
  _id: string;
  _idCodeApproval: {
    _id: string;
    label: string;
    code: string;
    status: string;
    index: number;
  };
  status: string;
  indexSTT: number;
  specificCodeApprove: ISpecificCodeApprove[];
  excludeCodeApprove: IExcludeCodeApprove[];
}
export interface IFormTemplate {
  _id: string;
  nameForm: {
    vi: string;
    en: string;
  };
  typeForm: string;
  version: string;
  dateApply: string;
  fields: any[];
  codeApproval: ICodeApproval[];
  status: string;
}
export interface CodeApprovalOption {
  _id: string;
  label: string;
  code: string;
}