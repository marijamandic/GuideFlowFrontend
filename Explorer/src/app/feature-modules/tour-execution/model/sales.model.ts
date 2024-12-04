export interface Sales {
    id: number;
    createdAt: Date; 
    endsAt: Date;    
    discount: number; 
    tourIds: number[]; 
}
