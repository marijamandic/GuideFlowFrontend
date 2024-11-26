export interface TourBundle 
{
    id: Number,
    price: Number,
    status: BundleStatus,
    authorId: Number,
    tourId: Array<Number>
}

export enum BundleStatus
{
    Draft,
    Published,
    Archived
}