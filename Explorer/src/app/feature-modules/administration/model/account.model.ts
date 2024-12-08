export interface Account{
    id: number,
    username: string,
    email: string,
    role: UserRole,
    lastOnline: Date;
    isActive: boolean
}
export enum UserRole {
    Administrator,
    Author,
    Tourist 
  }