export interface Comment{
    id?:number
    userId:number
    postId:number
    createdAt:Date
    content:string
    lastModified:Date
}