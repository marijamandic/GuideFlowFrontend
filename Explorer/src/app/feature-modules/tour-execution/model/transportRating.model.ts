export interface TransportRatings{
    rating: number,
    transportMode: TransportMode;
}

export enum TransportMode{
    Walk = 0,
    Bike = 1,
    Car = 2,
    Boat = 3
}