import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'
import { ErrorStateMatcher } from '@angular/material/core';
import { NotificationService } from '../../services/notification.service';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

declare var $: any;

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  eventaddForm: FormGroup;
  event_name: FormControl;
  event_location: FormControl;
  event_description: FormControl;
  event_startdate: FormControl;
  event_enddate: FormControl;
  event_starttime: FormControl;
  event_endtime: FormControl;

  showErrors: boolean = false;

  constructor( public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService,
    public router: Router) { }

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
    
  }
  createFormControl() {
    this.event_name = new FormControl("", [Validators.required]);
    this.event_location = new FormControl("", [Validators.required]);
    this.event_description = new FormControl("", [Validators.required, Validators.maxLength(300)]);
    this.event_startdate = new FormControl("", [Validators.required]);
    this.event_enddate = new FormControl("", [Validators.required]);
    this.event_starttime = new FormControl("", [Validators.required]);
    this.event_endtime = new FormControl("", [Validators.required]);
  }

  createFormGroup() {
    this.eventaddForm = new FormGroup({
      event_name: this.event_name,
      event_location: this.event_location,
      event_description: this.event_description,
      event_startdate: this.event_startdate,
      event_enddate: this.event_enddate,
      event_starttime: this.event_starttime,
      event_endtime: this.event_endtime,
    });
    // console.log(this.bookaddForm);
  }

  eventadd(value){
    var status = this.SessionStore.retrieve('user-data');
    console.log(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    value.org_id = status[0].org_code;
    value.master_id = status[0].master_id;

    this.http.post(`${environment.apiUrl}/event/addevent`, value, options).map(res => res.json())
    .subscribe(data => {
      // console.log(data);
      if (!data.error && data.data) {
        this.notification.showNotification(
          "top",
          "right",
          "success",
          "Event Added SuccessFuly"
        );
        this.router.navigate(["/event/index"]);
      } else {
        this.notification.showNotification(
          "top",
          "right",
          "warning",
          "Something Went Wrong"
        );
        this.eventaddForm.reset();
      }
    })
  }
}
