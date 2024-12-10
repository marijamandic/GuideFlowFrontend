export interface ProfileInfo{
    id?: number,
    userId: number,
    firstName: string, 
    lastName: string,
    imageUrl: string,
    imageBase64: string, 
    biography: string, 
    moto: string,
    followers?: FollowerDto[]; // Dodato polje Followers
}
export interface FollowerDto {
    followerId: number; // Samo potrebna polja
    followerUsername: string;
    imageUrl: string;
}