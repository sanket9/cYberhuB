import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLibraryComponent } from './add-library/add-library.component';
import { BookListingComponent } from './book-listing/book-listing.component'
import { EditBookComponent } from './edit-book/edit-book.component'
const routes: Routes = [
  {
    path: "index",
    component: BookListingComponent
  },
  {
    path: "add-book",
    component: AddLibraryComponent
  },
  {
    path: "edit-book",
    component: EditBookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryManagementRoutingModule { }
