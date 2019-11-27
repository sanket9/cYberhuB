import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AddUserComponent } from '../../add-user/add-user.component';
import { NoticeManagementComponent } from "../../notice-management/notice-management.component";
import { AddDetailsComponent } from "../../add-details/add-details.component";
import { ClassListComponent } from 'app/class-list/class-list.component';
import { GalleryUploadComponent } from '../../gallery-upload/gallery-upload.component';
import { SearchUserComponent } from '../../search-user/search-user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { PageName: "Login Page" }
    },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: 'table-list', component: TableListComponent, canActivate: [AuthGuard]},
    { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard]},
    { path: 'notifications', component: NotificationsComponent },
    { path: 'notice', canActivate: [AuthGuard], component: NoticeManagementComponent },
    { path: 'addClass', component: ClassListComponent, canActivate: [AuthGuard]},
    {
        path: "gallery",
        canActivate: [AuthGuard],
        component: GalleryUploadComponent
    },
    {
        path: "search-user",
        canActivate: [AuthGuard],
        component: SearchUserComponent
    },
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
    {
        path: "routine",
        canActivate: [AuthGuard],
        loadChildren: "../../routine-system/routine-system.module#RoutineSystemModule"
    },
    {
        path: "school/module",
        canActivate: [AuthGuard],
        loadChildren: "../../school-modules/school-modules.module#SchoolModulesModule"
    },
    { path: 'add-user-details', component: AddDetailsComponent, canActivate: [AuthGuard] },   
];
