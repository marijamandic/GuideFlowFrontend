
import { Checkpoint } from "./tourCheckpoint.model";
import { TourReview } from "./tourReview";

export interface Tour {
    id: number;
    name: string;
    description: string;
    price: Price;
    level: Level;
    status: TourStatus;
    lengthInKm: number;
    averageGrade: number;
    taggs: string[];
    checkpoints: Checkpoint[];
    transportDurations: TransportDuration[];
    reviews: TourReview[];
}

export interface Price {
    cost: number;
    currency: Currency;
}
export enum Currency {
    RSD = 0,
    EUR = 1,
    USD = 2
}

export interface TransportDuration {
    time: TimeSpan;
    transportType: TransportType;
}
export class TimeSpan {
    hours: number;
    minutes: number;
}

export enum TransportType {
    Car = 0,
    Bicycle = 1,
    Walking = 2

}

export enum TourStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
}

export enum Level {
    Easy = 0,
    Advanced = 1,
    Expert = 2
}




