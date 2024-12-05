export interface TouristRegistraion {
    id: number;
    username: string;
    password: string;
    role: number;
    location: {
        latitude: number;
        longitude: number;
    }; 
}
  