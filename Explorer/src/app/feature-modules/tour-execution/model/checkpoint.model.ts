export interface Checkpoint {
    id: number;
    name: string;
    description: string;
    secret: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    tourId: number;
}