import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolModulesRoutingModule } from './school-modules-routing.module';
import { IndexComponent } from './index/index.component';
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
  MatGridListModule
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
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
    MatGridListModule
  ],
  declarations: [IndexComponent]
})
export class SchoolModulesModule { }
