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
  MatProgressSpinnerModule,
  MatDatepickerModule,
  DateAdapter
} from "@angular/material";

import { ListroomComponent } from './listroom/listroom.component';
import { ComponentsModule } from "../components/components.module";
import { ScheduleExamComponent } from './schedule-exam/schedule-exam.component';
import { MapingRoomsComponent } from './maping-rooms/maping-rooms.component';
import { MyDateAdapter } from './schedule-exam/MyDateAdapter';

const MY_DATE_FORMATS = {
  parse: {
      dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
  },
  display: {
      // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};

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
    MatDatepickerModule,
    MatProgressSpinnerModule,
    ExamManagementRoutingModule,    
  ],
  declarations: [AddRoomComponent, ListroomComponent, ScheduleExamComponent, MapingRoomsComponent],
  providers: [
    NotificationService,
    {provide: DateAdapter, useClass: MyDateAdapter},
    {provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ]
})
export class ExamManagementModule {}
