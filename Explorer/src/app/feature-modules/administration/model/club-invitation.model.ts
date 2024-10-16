export enum ClubInvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    CANCELLED = 'CANCELLED'
  }
  
  export interface ClubInvitation {
    id?: number;
    clubId: number;
    touristId: number;
    status: ClubInvitationStatus;
  }
  