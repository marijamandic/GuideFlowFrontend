import { EncounterLocation } from "./location.model";

export interface Encounter {
    id?: number;
    name: string;
    description: string;
    encounterLocation: EncounterLocation;
    encounterStatus: EncounterStatus;
    experiencePoints: number;
    encounterType: EncounterType;
}

export enum EncounterStatus {
    Active = 0,
    Draft = 1,
    Archieved = 2
}
export enum EncounterType {
    Social = 0,
    Location = 1,
    Misc = 2
}