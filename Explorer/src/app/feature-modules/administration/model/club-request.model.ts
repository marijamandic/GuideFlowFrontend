export enum ClubRequestStatus {
    PENDING = 0,
    ACCEPTED = 1,
    DECLINED = 2,
    CANCELLED = 3
  }

export interface ClubRequest{
    id?: number,
    clubId: number,
    touristId: number,
    status: ClubRequestStatus,
   
}