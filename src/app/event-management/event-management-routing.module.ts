import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { ListEventsComponent } from './list-events/list-events.component';
import { EditEventsComponent } from './edit-events/edit-events.component';

const routes: Routes = [
  {
    path: "index",
    component: ListEventsComponent
  },
  {
    path: "add-event",
    component: AddEventComponent
  },
  {
    path: "edit-events",
    component: EditEventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagementRoutingModule { }
