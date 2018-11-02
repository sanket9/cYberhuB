import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventManagementRoutingModule } from './event-management-routing.module';
import { AddEventComponent } from './add-event/add-event.component';
import { ListEventsComponent } from './list-events/list-events.component';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from '../services/notification.service'

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
  MatDatepickerModule,
  MatNativeDateModule
} from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    EventManagementRoutingModule,
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
    MatTabsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers: [MatDatepickerModule,NotificationService],
  declarations: [AddEventComponent, ListEventsComponent, EditEventsComponent]
})
export class EventManagementModule { }
