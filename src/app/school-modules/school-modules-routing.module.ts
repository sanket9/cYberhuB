import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from "./index/index.component";
import { PtmeatingComponent } from './ptmeating/ptmeating.component';
import { ListPtmeetingComponent } from './list-ptmeeting/list-ptmeeting.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "index",
  },
  {
    path: "index",
    component: IndexComponent
  },
  {
    path: "ptmeeting/add",
    component: PtmeatingComponent
  },
   {
     path: 'ptmeeting/list',
      component: ListPtmeetingComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolModulesRoutingModule { }
