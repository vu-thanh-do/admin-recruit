export interface IAddRole {
  PermissionName: string
  Actions: {
    ActionName: string
    Route: string
  }[]
}