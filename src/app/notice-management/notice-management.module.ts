import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddNoticeComponent } from "./add-notice/add-notice.component";
import { NoticeManagementRoutingModule } from "./notice-management-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from "../services/api/api.service";

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

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
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
    MatGridListModule
  ],

  declarations: [AddNoticeComponent],

  providers: [ApiService]
})
export class NoticeManagementModule {}
