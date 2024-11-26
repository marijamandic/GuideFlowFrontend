export interface TourBundle 
{
    id: number,
    name: string,
    price: Number,
    status: BundleStatus,
    authorId: number,
    tourIds: Array<number> 
}

export enum BundleStatus
{
    Draft,
    Published,
    Archived
}