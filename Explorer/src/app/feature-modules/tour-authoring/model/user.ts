export interface User {
    id?: number; // opcionalno, ako želiš da imaš ID
    username: string;
    password: string; // može biti problematično deliti lozinku
    role: number; // pretpostavljam da imaš UserRole enum
    isActive: boolean;
    location: {
        latitude: number;
        longitude: number;
    }; // Lokacija kao unutrašnji objekat
}