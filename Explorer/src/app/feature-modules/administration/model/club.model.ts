export interface Club{
    id?: number,
    ownerId: number,
    name: string,
    description: string,
    imageUrl: string, 
    requested?: boolean
}