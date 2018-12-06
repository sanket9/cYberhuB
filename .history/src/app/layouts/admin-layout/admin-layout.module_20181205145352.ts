import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AddUserComponent } from '../../add-user/add-user.component';
import { NoticeManagementComponent, ModalDialog } from "../../notice-management/notice-management.component";
import { AddDetailsComponent } from '../../add-details/add-details.component';
import { ClassListComponent } from "app/class-list/class-list.component";
import { NotificationService } from '../../services/notification.service';
// import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from "../../components/components.module";
import { HttpModule } from "@angular/http";

import {
  HttpModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from "@angular/material";


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],

  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    NotificationsComponent,
    AddUserComponent,
    NoticeManagementComponent,
    AddDetailsComponent,
    ClassListComponent,
    ModalDialog
  ],

  entryComponents: [ModalDialog],
  exports: [],
  providers: [NotificationService]
})
export class AdminLayoutModule {}
