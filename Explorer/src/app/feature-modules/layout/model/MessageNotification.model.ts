export interface MessageNotification {
    id: number;
    message: string;
    isBlog: boolean;
    isOpened: boolean;
    createdAt: Date;
    objectId: number;
    senderId: number;
    sender: string;
    userId: number;
}
