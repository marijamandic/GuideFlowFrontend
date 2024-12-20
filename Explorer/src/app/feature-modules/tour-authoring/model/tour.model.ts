
import { Price } from "./price.model";
import { Checkpoint } from "./tourCheckpoint.model";
import { TourReview } from "./tourReview";
import { TransportDuration } from "./transportDuration.model";
import { WeatherCondition } from "./weatherCondition.model";

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
    isPremium?:boolean;
    lengthInKm: number;
    averageGrade: number;
    weatherRequirements:WeatherCondition
    taggs: string[];
    checkpoints: Checkpoint[];
    transportDurations: TransportDuration[];
    reviews: TourReview[];
    weatherIcon?: string;
    temperature?: number;
    weatherDescription?: string;
    weatherRecommend?: number;
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




