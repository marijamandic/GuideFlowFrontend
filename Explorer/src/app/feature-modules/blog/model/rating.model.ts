export interface Rating {
    id: number,
    ratingStatus: RatingStatus,
    userId: number,
    postId: number,
    hasVoted?: boolean
}


export enum RatingStatus {
    Plus = 0,
    Minus = 1      
}