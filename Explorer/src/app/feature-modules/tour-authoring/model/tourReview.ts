import { Time } from "@angular/common"


export interface TourReview {
    rating: number,
    comment: string,
    tourDate: DateTime,
    creationDate: DateTime
}

export interface DateTime{
    date: Date,
    time: Time
}