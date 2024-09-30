export class User  {
    id: string  = "";
    userName:string  = "";
    role:string = "GUEST";
    attendence?: AttendanceModel[]= [];
    shift?:string = "";
    workingTime?: string = "";
    workingDays?: string = "";
    managerId?:string="";
    email?:string="";
    password?:string;
}

export class AttendanceModel {
    id: string;
    date:Date = new Date();
    img: string  = "";
    userId: string;
    managerId:string;
}

export class LoginUser {
    email:string;
    password:string;
}