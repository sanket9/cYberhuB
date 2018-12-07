import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from "./index/index.component";
import { AddRoutineComponent } from "./add-routine/add-routine.component";
import { AssignClassComponent } from './assign-class/assign-class.component';
import { SubjectAddComponent } from "./subject-add/subject-add.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "index"
    //component: IndexComponent
  },
  {
    path: "index",
    component: IndexComponent
  },
  {
    path: "create",
    component: AddRoutineComponent
  },
  {
    path: "class-assign",
    component: AssignClassComponent
  },
  {
    path: "subject-add",
    component: SubjectAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutineSystemRoutingModule { }
