export interface User {
    id: number;
    username: string;
    role: string;
    location: {
        latitude: number;
        longitude: number;
    }; 
}
  