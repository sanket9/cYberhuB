import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
@Component({
  selector: "app-edit-routine",
  templateUrl: "./edit-routine.component.html",
  styleUrls: ["./edit-routine.component.scss"]
})
export class EditRoutineComponent implements OnInit {
  editRoutine: FormGroup;
  day: string;
  sem: string;
  dept: string;
  year: string;
  org_id: string;
  constructor(
    private _route: ActivatedRoute,
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {    
    this._route.queryParams.subscribe(params => {
      this.day = params.day;
      this.sem = params.sem;
      this.year = params.year;
      this.dept = params.dept;
    });
    var status = this.SessionStore.retrieve("user-data");
   this.org_id = status[0].org_code;
  }

}
