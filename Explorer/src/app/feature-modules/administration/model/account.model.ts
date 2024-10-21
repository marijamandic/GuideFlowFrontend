export interface Account{
    userId: number,
    username: string,
    mail: string,
    role: UserRole,
    isActive: boolean
}
export enum UserRole {
    Administrator,
    Author,
    Tourist 
  }