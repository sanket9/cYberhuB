import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from "./index/index.component";
import { PtmeatingComponent } from './ptmeating/ptmeating.component';
import { ListPtmeetingComponent } from './list-ptmeeting/list-ptmeeting.component';
import { ListSyllabusComponent } from './list-syllabus/list-syllabus.component';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';

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
  },
  {
    path: 'syllabus/list',
    component: ListSyllabusComponent
  },
  {
    path: 'syllabus/add',
    component: AddSyllabusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolModulesRoutingModule { }
