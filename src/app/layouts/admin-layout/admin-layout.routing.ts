import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AddUserComponent } from '../../add-user/add-user.component';
import { NoticeManagementComponent } from "../../notice-management/notice-management.component";
import { AddDetailsComponent } from "../../add-details/add-details.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { PageName: "Login Page" }
    },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'add-user', component: AddUserComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'notice', component: NoticeManagementComponent },
    {
      path: "notice-management",
      canActivate: [AuthGuard],
      loadChildren: '../../notice-management/notice-management.module#NoticeManagementModule'
    },
    {
        path: "library",
        canActivate: [AuthGuard],
        loadChildren: "../../library-management/library-management.module#LibraryManagementModule"
    },
    {
        path: "event",
        canActivate: [AuthGuard],
        loadChildren: "../../event-management/event-management.module#EventManagementModule"
    },
    {
        path: "exam",
        canActivate: [AuthGuard],
        loadChildren: "../../exam-management/exam-management.module#ExamManagementModule"
    },
    { path: 'add-user-details', component: AddDetailsComponent },   
];
