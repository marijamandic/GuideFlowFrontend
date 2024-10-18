export enum ClubInvitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2,
  CANCELLED = 3
}


export interface ClubInvitation {
  id?: number;
  clubId: number;
  touristId: number;
  status: ClubInvitationStatus;
}
