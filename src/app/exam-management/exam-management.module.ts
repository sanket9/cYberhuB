import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamManagementRoutingModule } from './exam-management-routing.module';
import { AddRoomComponent } from './add-room/add-room.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../services/notification.service";
import {
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
  MatTabsModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { ListroomComponent } from './listroom/listroom.component';
import { ComponentsModule } from "../components/components.module";
import { ScheduleExamComponent } from './schedule-exam/schedule-exam.component';
import { MapingRoomsComponent } from './maping-rooms/maping-rooms.component';

@NgModule({
  imports: [
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
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
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ExamManagementRoutingModule,
    
  ],
  declarations: [AddRoomComponent, ListroomComponent, ScheduleExamComponent, MapingRoomsComponent],
  providers: [NotificationService]
})
export class ExamManagementModule {}
