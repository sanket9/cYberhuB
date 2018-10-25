import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AddUserComponent } from '../../add-user/add-user.component';
import { NoticeManagementComponent } from "../../notice-management/notice-management.component";
import { AddDetailsComponent } from "../../add-details/add-details.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent,
        data: { PageName: "Login Page" }
    },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'add-user', component: AddUserComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'notice', component: NoticeManagementComponent },
    { path: 'add-user-details', component: AddDetailsComponent },
   
];
