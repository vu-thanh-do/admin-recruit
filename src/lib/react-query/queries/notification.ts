import { useQuery } from '@tanstack/react-query'
import { NotificationResponse } from '@/types/notification'

interface UseNotificationsParams {
  page?: number
  limit?: number
}

export const useNotifications = ({ page = 1, limit = 10 }: UseNotificationsParams = {}) => {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async (): Promise<NotificationResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?page=${page}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      return response.json()
    }
  })
} 