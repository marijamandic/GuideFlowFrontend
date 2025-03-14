export interface Club{
    id?: number,
    ownerId: number,
    name: string,
    description: string,
    imageUrl: string,
    imageBase64: string,
    requested?: boolean,
    hasAccepted?: boolean,
    memberCount: number;
}