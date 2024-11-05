export interface Post {
    id: number;          
    title: string;       
    userId: number;   
    username: string;
    description: string;  
    publishDate: Date;    
    imageUrl: string;
    imageBase64: string;   
    status: Status;
    isRated?: boolean;
    isRatedPositively?: boolean;
}   

export enum Status {
    Draft = 0,         
    Published = 1, 
    Closed = 2        
}
