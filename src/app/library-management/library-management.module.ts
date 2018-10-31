import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service'
import { LibraryManagementRoutingModule } from './library-management-routing.module';
import { AddLibraryComponent } from './add-library/add-library.component';
import { BookListingComponent } from './book-listing/book-listing.component';
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
import { EditBookComponent } from './edit-book/edit-book.component';
@NgModule({
  imports: [
    CommonModule,
    LibraryManagementRoutingModule,
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
    MatPaginatorModule
  ],
  declarations: [AddLibraryComponent, BookListingComponent, EditBookComponent],
  providers: [NotificationService]
})
export class LibraryManagementModule {}
