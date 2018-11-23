import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from "./index/index.component";
import { AddRoutineComponent } from "./add-routine/add-routine.component";
import { AssignClassComponent } from './assign-class/assign-class.component'
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutineSystemRoutingModule { }
