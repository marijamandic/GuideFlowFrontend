export interface Rating {
    id: number,
    ratingStatus: RatingStatus,
    userId: number,
    postId: number,
    createdDate: Date | string
}


export enum RatingStatus {
    Plus = 0,
    Minus = 1      
}