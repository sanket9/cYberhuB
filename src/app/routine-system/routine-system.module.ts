import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutineSystemRoutingModule } from './routine-system-routing.module';
import { IndexComponent } from './index/index.component';
import { AddRoutineComponent } from './add-routine/add-routine.component';
import { ComponentsModule } from "../components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../services/notification.service";
import { AmazingTimePickerModule } from "amazing-time-picker";
// import {
//   MatFormFieldModule,
//   MatButtonModule,
//   MatInputModule,
//   MatRippleModule,
//   MatTooltipModule,
//   MatOptionModule,
//   MatSelectModule,
//   MatTableModule,
//   MatCheckboxModule,
//   MatCardModule,
//   MatIconModule,
//   MatExpansionModule,
//   
// MatGridListModule,
// } from "@angular/material";
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
  MatExpansionModule,
  MatGridListModule,
  MatDialogModule,
  MatDatepickerModule,
  MatRadioModule
} from "@angular/material";
import { AssignClassComponent } from './assign-class/assign-class.component';
import { SubjectAddComponent } from './subject-add/subject-add.component';
import { CoursesSubjectComponent } from './courses-subject/courses-subject.component';
import { ViewRutineComponent } from './view-rutine/view-rutine.component';
import { EditRoutineComponent, DialogOverviewExampleDialog  } from './edit-routine/edit-routine.component';
import { EditShiftClassComponent } from './edit-shift-class/edit-shift-class.component';
@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    AmazingTimePickerModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
    ComponentsModule,
    RoutineSystemRoutingModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatRadioModule
  ],
  providers: [NotificationService],
  declarations: [
    IndexComponent,
    AddRoutineComponent,
    AssignClassComponent,
    SubjectAddComponent,
    CoursesSubjectComponent,
    ViewRutineComponent,
    EditRoutineComponent,
    EditShiftClassComponent,
    DialogOverviewExampleDialog 
  ],
  entryComponents: [
    EditRoutineComponent,
    DialogOverviewExampleDialog
  ]
})
export class RoutineSystemModule {}
