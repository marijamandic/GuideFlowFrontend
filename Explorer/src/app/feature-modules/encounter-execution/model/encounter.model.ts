import { EncounterLocation } from "./location.model";

export interface Encounter {
    $type?: string;
    id?: number;
    name: string;
    description: string;
    encounterLocation: EncounterLocation;
    encounterStatus: EncounterStatus;
    experiencePoints: number;
    encounterType: EncounterType;
    touristNumber?: number; // SocialEncounter
    encounterRange?: number; // SocialEncounter
    imageUrl?: string; // LocationEncounter
    activationRange?: number; // LocationEncounter
    checkpointId?: number; // LocationEncounter
    imageLatitude?: number; // Koordinate slike
    imageLongitude?: number; // Koordinate slike
    actionDescription?: string; // MiscEncounter
    imageBase64?: string;
}

export enum EncounterStatus {
    Active = 0,
    Draft = 1,
    Archieved = 2,
    Pending = 3,
    Canceled = 4
}

export enum EncounterType {
    Social = 0,
    Location = 1,
    Misc = 2
}
