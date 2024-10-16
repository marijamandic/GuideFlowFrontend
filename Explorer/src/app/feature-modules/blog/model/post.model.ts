export interface Post {
    id: number;          
    title: string;       
    userId: number;   
    description: string;  
    publishDate: Date;    
    imageUrl: string;   
    status: Status;      
}

export enum Status {
    Draft = 0,         
    Published = 1, 
    Closed = 2        
}
