export interface PublicPointNotification {
    id: number; 
    publicPointId: number; 
    authorId: number; 
    isAccepted: boolean;
    comment: string;
    isRead: boolean;
    creationTime: Date
}