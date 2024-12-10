export interface MessageNotification{
    isBlog: boolean;
    message: string;
    isOpened: boolean;
    objectId: number;
    senderId: number;
    sender: string;
    userId: number;
    createdAt: Date;
}