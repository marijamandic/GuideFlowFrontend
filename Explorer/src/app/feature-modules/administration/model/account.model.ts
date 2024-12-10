export interface Account{
    id: number,
    username: string,
    email: string,
    role: UserRole,
    lastLogout: Date;
    isActive: boolean
}
export enum UserRole {
    Administrator,
    Author,
    Tourist 
  }