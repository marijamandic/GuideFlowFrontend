import { EncounterLocationDto } from "./location.model";

export interface Encounter {
    id?: number;
    name: string;
    description: string;
    encounterLocationDto: EncounterLocationDto;
    encounterStatus: EncounterStatus;
    experiencePoints: number;
}

export enum EncounterStatus {
    Active = 0,
    Draft = 1,
    Archieved = 2
}