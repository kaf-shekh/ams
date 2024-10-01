import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AttendanceListComponent } from 'src/app/components/attendance-list/attendance-list.component';
import { MarkAttendanceComponent } from 'src/app/components/mark-attendance/mark-attendance.component';
import { StaffListComponent } from 'src/app/components/staff-list/staff-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddUpdateStaffComponent } from 'src/app/components/add-update-staff/add-update-staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingComponent } from '../setting/setting.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AttendanceService } from 'src/app/services/attendance.service';
import { PageGuard } from 'src/app/core/auth/page.gaurd';
const routes: Routes = [
    {
        path: '', component: HomeComponent, children: [
            { path: '', redirectTo:'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, canActivate: [PageGuard] },
            { path: 'attendance', component: AttendanceListComponent, canActivate: [PageGuard] },
            { path: 'mark-attendance', component: MarkAttendanceComponent, canActivate: [PageGuard] },
            { path: 'staff', component: StaffListComponent, canActivate: [PageGuard] },
            { path: 'setting', component: SettingComponent, canActivate: [PageGuard] },
        ]
    },
];

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent,
        AttendanceListComponent,
        MarkAttendanceComponent,
        StaffListComponent,
        AddUpdateStaffComponent,
        SettingComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [AttendanceService],
})
export class HomeModule { }
