export interface TransportDuration {
    time: number;
    transportType: TransportType;
}

export enum TransportType {
    Car = 0,
    Bicycle = 1,
    Walking = 2
}