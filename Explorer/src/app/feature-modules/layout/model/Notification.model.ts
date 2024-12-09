export enum NotificationType {
    ProblemNotification = 0,
    MoneyExchange = 1,
}

export interface Notification {
    id: number,
    userId: number;          
    sender: string;          
    message: string;         
    createdAt: Date;         
    isOpened: boolean;       
    type: NotificationType;  
}
