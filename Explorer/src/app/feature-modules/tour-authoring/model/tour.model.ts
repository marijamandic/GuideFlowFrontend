
import { Price } from "./price.model";
import { Checkpoint } from "./tourCheckpoint.model";
import { TourReview } from "./tourReview";
import { TransportDuration } from "./transportDuration.model";

export interface Tour {
    id: number;
    authorId: number;
    authorName?: string;
    name: string;
    description: string;
    price:  number;
    level: Level;
    status: TourStatus;
    StatusChangeDate?:Date;
    lengthInKm: number;
    averageGrade: number;
    taggs: string[];
    checkpoints: Checkpoint[];
    transportDurations: TransportDuration[];
    reviews: TourReview[];
}

export enum TourStatus {
    Draft = 0,
    Published = 1,
    Archived = 2,
    Deleted = 3
}

export enum Level {
    Easy = 0,
    Advanced = 1,
    Expert = 2
}




