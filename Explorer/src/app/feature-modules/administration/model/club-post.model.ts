export enum ResourceType {
    BLOG = 0,
    TOUR = 1
  }
  

export interface ClubPost{
    id:number,
    clubId: number,
    memberId: number,
    content: string, 
    resourceId: number,
    resourceType: ResourceType,
    username?: string
}