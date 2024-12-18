import { UserRole } from "src/app/feature-modules/administration/model/account.model";

export interface Registration {
    name: string,
    surname: string,
    email: string,
    username: string,
    password: string,
    location: { latitude: number; longitude: number };
    role: UserRole;
    xp?: Number;
    level?:Number;
    wallet?:Number;
    $type:string;
}