export interface EmployeeSpecific {
  _id: string
  code: string
  name: string
  division: string
  divisionCode?: string
  section: string
  sectionCode?: string
  position: string
  grade: string
  entryDate: string
  actualLeaveDate: string
  note: string
}
export interface SpecificResignData {
  _id: string
  group: string
  key: string
  data: {
    dept: string
    info: EmployeeSpecific[]
  }
  createdAt: string
  updatedAt: string
}

export interface EmployeeEzV4 {
  ResignID: number
  EmployeeID: number
  EmployeeCode: string
  FullName: string
  Email: string | null
  JoinDate: string
  Detail: string
  DaysOfNotification: number
  IsLegal: boolean
  LastWorkingDate: string
  DecisionNo: string
  DecisionDate: string
  NoOfViolationDays: number
  IsNeedReplacement: boolean
  RecruitmentPeriod: number
  ResignDate: string
  DepartmentID: number
  teamId: number
  teamName: string
  groupId: number
  groupName: string
  sectionId: number
  sectionName: string
  departmentId: number
  departmentName: string
  divisionId: number
  divisionName: string
  position: string
  grade: string
}