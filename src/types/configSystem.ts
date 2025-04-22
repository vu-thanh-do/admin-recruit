export interface GroupConfigSystem {
  data: {
    count: number
    nameGroup: string
  }[],
  paginator: {
    total: number
    perPage: number
    currentPage: number
    pageCount: number
    slNo: number
  } 
}

export interface GroupConfigSystemResponse {
  status: number
  message: string
  data: GroupConfigSystem
}
