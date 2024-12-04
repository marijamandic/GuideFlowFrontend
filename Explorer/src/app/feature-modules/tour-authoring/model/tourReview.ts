export interface TourReview{
    id?: number,
    rating?: number,
    comment?: string,
    creationDate?: Date,
    tourDate?: Date,
    percentageCompleted?: number,
    touristId: number,
    tourId: number
}