import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamManagementRoutingModule } from './exam-management-routing.module';
import { AddRoomComponent } from './add-room/add-room.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
  MatPaginatorModule
} from "@angular/material";
@NgModule({
  imports: [
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
    ExamManagementRoutingModule
  ],
  declarations: [AddRoomComponent]
})
export class ExamManagementModule { }
