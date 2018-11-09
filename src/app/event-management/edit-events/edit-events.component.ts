import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ErrorStateMatcher } from "@angular/material/core";
import { NotificationService } from "../../services/notification.service";
import { Location } from "@angular/common";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.scss']
})
export class EditEventsComponent implements OnInit {
  eventEditForm: FormGroup;
  event_name: FormControl;
  event_location: FormControl;
  event_description: FormControl;
  event_startdate: FormControl;
  event_enddate: FormControl;
  event_starttime: FormControl;
  event_endtime: FormControl;

  showErrors: boolean = false;
  routedData: any;
  constructor(
    private activated_route: ActivatedRoute,
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public location: Location
  ) { 

    this.activated_route.queryParams.subscribe(data => {
      this.location.replaceState(this.location
          .path()
          .split("?")[0], "");
          if(data.data){
                    
            let result = atob(data.data);           
            result = JSON.parse(result);
            console.log(result);   
            this.routedData = result;
          }else{
            this.router.navigate(["event/index"]);
          }
      
    });
  }

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    this.event_name = new FormControl(this.routedData.event_name, [Validators.required]);
    this.event_location = new FormControl(this.routedData.event_location, [Validators.required]);
    this.event_description = new FormControl(this.routedData.event_description, [Validators.required]);
    this.event_startdate = new FormControl(this.routedData.event_startdate, [Validators.required]);
    this.event_enddate = new FormControl(this.routedData.event_enddate, [Validators.required]);
    this.event_starttime = new FormControl(this.routedData.event_startime, [Validators.required]);
    this.event_endtime = new FormControl(this.routedData.event_endtime, [Validators.required]);
  }

  createFormGroup() {
    this.eventEditForm = new FormGroup({
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
  eventUpdate(value){
    // console.log(value);
    
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    value.id = this.routedData.id;
    this.http.post(`${environment.apiUrl}event/updateevent`, value, options)
    .map(res => res.json()).subscribe(data => {
      // console.log(data);
      if (!data.error && data.data) {
        this.notification.showNotification(
          "top",
          "right",
          "success",
          "Event Updated SuccessFuly"
        );
        this.router.navigate(["/event/index"]);
      } else {
        this.notification.showNotification(
          "top",
          "right",
          "warning",
          "Something Went Wrong"
        );
        this.eventEditForm.reset();
      }
    })
  }
}
