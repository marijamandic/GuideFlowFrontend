import { TransportRatings } from "./transportRating.model";

export interface TourSpecification {
    id?: number;
    userId: number;
    level: Level;
    taggs: string[],
    transportRatings: TransportRatings[];
}

export enum Level {
    Easy = 0,
    Advanced = 1,
    Expert = 2
}