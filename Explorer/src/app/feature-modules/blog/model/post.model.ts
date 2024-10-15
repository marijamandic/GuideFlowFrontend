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
    Draft = 'Draft',         
    Published = 'Published', 
    Closed = 'Closed'        
}
