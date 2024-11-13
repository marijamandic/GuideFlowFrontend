import { Checkpoint } from "./checkpoint.model";

export interface PurchasedTours{
    id: number,
    name: string,
    description: string,
    level: Level,
    tourStatus: Status,
    averageGrade: number,
    lengthInKm: number
    checkpoints : Checkpoint[];
}

export enum Level{
    Easy = 0,
    Advanced = 1,
    Expert = 2
}

export enum Status{
    Draft = 0,
    Published = 1,
    Archived = 2    
}