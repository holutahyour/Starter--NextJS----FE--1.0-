export interface INotification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId: string;
  title: string;
  notificationType?: string;
  notificationTypeId?: number;
  userId?: string;
}

export interface INotificationResponse {
  content: INotification[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}