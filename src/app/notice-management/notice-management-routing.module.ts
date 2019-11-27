import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNoticeComponent } from './add-notice/add-notice.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { ChooseNoticeTypeComponent } from './choose-notice-type/choose-notice-type.component';

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
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "add-notice"
  },
  {
    path: "add-notice",
    component: AddNoticeComponent
  },
  {
    path: "edit/:id",
    component: EditComponent
  },
  {
    path: "notice-type",
    component: ChooseNoticeTypeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forChild(routes),
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
    MatGridListModule
  ],

  exports: [RouterModule]
})
export class NoticeManagementRoutingModule { }
