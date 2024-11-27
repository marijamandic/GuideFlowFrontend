export interface Checkpoint {
    id?: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    imageBase64?: string;
    encounterId?: number;
    isEncounterEssential: boolean;  
    secret: string;
}
