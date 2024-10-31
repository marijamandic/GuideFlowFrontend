export interface Post {
    id: number;          
    title: string;       
    userId: number;   
    description: string;  
    publishDate: Date;    
    imageUrl: string;
    imageBase64: string;   
    status: Status;      
}

export enum Status {
    Draft = 0,         
    Published = 1, 
    Closed = 2,
    Active = 3,
    Famous = 4        
}
