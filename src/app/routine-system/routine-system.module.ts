import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutineSystemRoutingModule } from './routine-system-routing.module';
import { IndexComponent } from './index/index.component';
import { AddRoutineComponent } from './add-routine/add-routine.component';
import { ComponentsModule } from "../components/components.module";
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
  MatExpansionModule,
  MatGridListModule
} from "@angular/material";
import { AssignClassComponent } from './assign-class/assign-class.component';
@NgModule({
  imports: [
    CommonModule,
    CommonModule,
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
    RoutineSystemRoutingModule
  ],
  declarations: [IndexComponent, AddRoutineComponent, AssignClassComponent]
})
export class RoutineSystemModule { }