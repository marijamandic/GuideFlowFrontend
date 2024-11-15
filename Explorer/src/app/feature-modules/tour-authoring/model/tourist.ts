export interface Tourist {
    id?: number; 
    username: string;
    password: string; 
    role: number; 
    isActive: boolean;
    location: {
        latitude: number;
        longitude: number;
    }; 
}