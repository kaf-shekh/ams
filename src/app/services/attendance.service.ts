import { Injectable } from "@angular/core";
import { DataBaseService } from "./data-base.service";
import { Observable, of } from "rxjs";
import { AttendanceModel } from "../models/User";

@Injectable()
export class AttendanceService {

    constructor(private dbService: DataBaseService) { }
    addAttendence(req: AttendanceModel): Observable<any> {
        try {
            return this.dbService.addAtendancebyId(req)
        } catch (error) {
           return of(error)
        }
    }


}