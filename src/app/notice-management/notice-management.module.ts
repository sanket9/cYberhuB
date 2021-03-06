import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddNoticeComponent } from "./add-notice/add-notice.component";
import { NoticeManagementRoutingModule } from "./notice-management-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from "../services/api/api.service";
import { ComponentsModule } from "../components/components.module";
import { FlatpickrModule } from 'angularx-flatpickr';

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
  MatGridListModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from "@angular/material";

import { ChooseNoticeTypeComponent } from './choose-notice-type/choose-notice-type.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    NoticeManagementRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    FlatpickrModule.forRoot()
  ],

  declarations: [AddNoticeComponent, ChooseNoticeTypeComponent, EditComponent],

  providers: [ApiService]
})
export class NoticeManagementModule {}
