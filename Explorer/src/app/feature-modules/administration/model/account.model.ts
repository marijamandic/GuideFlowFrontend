export interface Account{
    userId: number,
    username: string,
    email: string,
    role: UserRole,
    isActive: boolean
}
export enum UserRole {
    Administrator,
    Author,
    Tourist 
  }