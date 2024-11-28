import { EncounterType } from "./encounter.model";

export interface Execution {
    id?: number,
    userId: number,
    encounterId: number,
    isComplete: boolean,
    encounterType: EncounterType,
    userLongitude: number,
    userLatitude: number,
    participants: number,
}