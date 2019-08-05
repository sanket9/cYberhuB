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
// import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { AmazingTimePickerService } from "amazing-time-picker";
// import { MatTableDataSource, MatPaginator } from "@angular/material";
// import { SelectionModel } from "@angular/cdk/collections";


@Component({
  selector: 'app-edit-shift-class',
  templateUrl: './edit-shift-class.component.html',
  styleUrls: ['./edit-shift-class.component.scss']
})
export class EditShiftClassComponent implements OnInit {
  showloader: boolean = false;
  id: string;
  editRoutine: FormGroup;
  period_name : any;
  from_time : any;
  to_time : any;


  constructor(
    public http: Http,
    // public notification: NotificationService,
    private atp: AmazingTimePickerService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.id = params.id;
    })
    // console.log(this.id);
    this.getClassDetails();
  }


  getClassDetails() {
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { id: this.id };
    this.http.post(`${environment.apiUrl}shift/classdetails`, data, options)
    .map(res => res.json())
    .subscribe(data => {
      this.showloader = false;
      // console.log(data);
      if (data.data.length > 0) {
        this.period_name = data.data[0].period_name;
        this.from_time = data.data[0].from_time;
        this.to_time = data.data[0].to_time;
        
      }
    })
  }

  update() {
    // console.log(this.from_time);
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { id: this.id, period_name: this.period_name, from_time: this.from_time, to_time: this.to_time};

    this.http.post(`${environment.apiUrl}shift/update-classs`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.showloader = false;
        if (data.status == 1) {
          this.router.navigate([`routine/create`])
        }
      })
  }
  
}
