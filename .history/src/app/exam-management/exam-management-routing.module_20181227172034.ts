import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AddRoomComponent } from './add-room/add-room.component';
import { ListroomComponent } from './listroom/listroom.component';
import { ScheduleExamComponent } from "./schedule-exam/schedule-exam.component";
import { MapingRoomsComponent } from "./maping-rooms/maping-rooms.component";

const routes: Routes = [
  {
    path: "index",
    component: ListroomComponent
  },
  {
    path: "addroom",
    component: AddRoomComponent
  },
  {
    path: "schedule",
    component: ScheduleExamComponent
  },
  {
    path: "room-select",
    component: MapingRoomsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamManagementRoutingModule { }
