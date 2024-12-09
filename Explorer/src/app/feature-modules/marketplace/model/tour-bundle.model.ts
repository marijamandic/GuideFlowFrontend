export interface TourBundle 
{
    id: number,
    name: string,
    price: number,
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