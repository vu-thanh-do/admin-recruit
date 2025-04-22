export type NotificationType = 'message' | 'update' | 'reminder'

export interface NotificationMetadata {
  requestTitle: string
  requesterName: string
  requesterCode: string
  link: string
}

export interface Notification {
  _id: string
  title: string
  content: string
  type: string
  userId: string
  role: string
  requestId: string
  requestType: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  metadata: NotificationMetadata
}

export interface NotificationResponse {
  docs: Notification[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface NotificationListProps {
  notifications: Notification[]
  handleNotificationClick: (id: string) => void
}

export const NotificationIcons: Record<string, string> = {
  PROCESSING_UPDATED: "🔄",
  STATUS_UPDATED: "📊",
  REQUEST_CREATED: "📝",
  REQUEST_APPROVED: "✅",
  REQUEST_REJECTED: "❌",
  default: "📣"
} 