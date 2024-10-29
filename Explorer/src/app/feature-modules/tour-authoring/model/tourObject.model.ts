export interface TourObject {
    id?: number;
    name: string;
    description: string;
    imageUrl: string;
    imageBase64: string; 
    category: number;
    latitude: number;
    longitude: number;
}