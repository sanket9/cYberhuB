import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { Ng2Webstorage } from "ngx-webstorage";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/admin-layout/admin-layout.module#AdminLayoutModule"
      }
    ]
  }
  // {
  //   path: "notice-management",
  //   loadChildren: './notice-management/notice-management.module#NoticeManagementModule'
  // }

  // { path: 'dashboard',      component: DashboardComponent },
  // { path: 'user-profile',   component: UserProfileComponent },
  // { path: 'table-list',     component: TableListComponent },
  // { path: 'typography',     component: TypographyComponent },
  // { path: 'icons',          component: IconsComponent },
  // { path: 'maps',           component: MapsComponent },
  // { path: 'notifications',  component: NotificationsComponent },
  // { path: 'upgrade',        component: UpgradeComponent },
  // { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    RouterModule.forRoot(routes),
    Ng2Webstorage
  ],
  exports: []
})
export class AppRoutingModule {}
