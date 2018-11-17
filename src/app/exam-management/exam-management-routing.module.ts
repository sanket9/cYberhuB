import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AddRoomComponent } from './add-room/add-room.component';
import { ListroomComponent } from './listroom/listroom.component'
const routes: Routes = [
  {
    path: "index",
    component: ListroomComponent
  },
  {
    path: "addroom",
    component: AddRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamManagementRoutingModule { }
