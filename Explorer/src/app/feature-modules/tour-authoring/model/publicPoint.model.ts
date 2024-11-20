export enum ApprovalStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2
}

export enum PointType {
    Checkpoint = 0,
    Object = 1
}

export interface PublicPoint {
    id: number; 
    name: string; 
    description: string; 
    latitude: number;
    longitude: number;
    imageUrl?: string;
    imageBase64?: string; 
    approvalStatus: ApprovalStatus; 
    type: PointType;
    authorId: number;
}