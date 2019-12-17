import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';

import { SchoolModulesRoutingModule } from './school-modules-routing.module';
import { IndexComponent } from './index/index.component';
import { ComponentsModule } from "../components/components.module";
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
  MatDatepickerModule
} from "@angular/material";
import { PtmeatingComponent } from './ptmeating/ptmeating.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule , ReactiveFormsModule} from "@angular/forms";
import { ListPtmeetingComponent } from './list-ptmeeting/list-ptmeeting.component';
import { NotificationService } from 'app/services/notification.service';
import { ListSyllabusComponent } from './list-syllabus/list-syllabus.component';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { EditSyllabusComponent } from './edit-syllabus/edit-syllabus.component';
import { HomeAssignmentComponent } from './home-assignment/home-assignment.component';

@NgModule({
  imports: [
    AmazingTimePickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SchoolModulesRoutingModule,
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
    MatDatepickerModule,
    FlatpickrModule.forRoot(),
    CKEditorModule,
    ComponentsModule
  ],
  declarations: [IndexComponent, PtmeatingComponent, ListPtmeetingComponent, ListSyllabusComponent, AddSyllabusComponent, EditSyllabusComponent, HomeAssignmentComponent],
  providers: [NotificationService],
})
export class SchoolModulesModule { }
