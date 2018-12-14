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

@Component({
  selector: "app-add-routine",
  templateUrl: "./add-routine.component.html",
  styleUrls: ["./add-routine.component.scss"]
})
export class AddRoutineComponent implements OnInit {
  showloader: boolean = false;
  createpriodForm: FormGroup;
  no_of_preiod: FormControl;
  class_id: FormControl;
  from_time: FormControl;
  to_time: FormControl;
  priods: FormArray;
  priod_name: any = [];
  classList: any;
  shift: any;
  shifs: any;
  constructor(
    public http: Http,
    // public notification: NotificationService,
    private atp: AmazingTimePickerService,
    public router: Router,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
    this.getClassList();
    // console.log(this.createpriodForm.value);
  }

  getClassList() {
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { org_id: status[0].org_code };
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.shifs = data.data;
      });
  }
  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      console.log(time);
    });
  }
  getClass() {
    // this.showloader = true;
    // var status = this.SessionStore.retrieve("user-data");
    // var headers = new Headers();
    // headers.append("Content-Type", "application/json");
    // let options = new RequestOptions({ headers: headers });
    // let data = { org_id: status[0].org_code };
    // // console.log(this.bookaddForm);
    // this.http
    //   .post(`${environment.apiUrl}classsection/getall`, data, options)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     //console.log(data);
    //     this.classList = data.data;
    //     this.showloader = false;
    //   });
  }
  createFormControl() {
    this.no_of_preiod = new FormControl("", [Validators.required]);
    this.shift = new FormControl("", [Validators.required]);
    this.priods = new FormArray([], [Validators.required]);
  }

  createFormGroup() {
    this.createpriodForm = new FormGroup({
      no_of_preiod: this.no_of_preiod,
      shift: this.shift,
      priods: this.priods
      // file_url: this.file_url
    });
  }

  priodchange(e) {
    //console.log(e.target.value);
    let data = this.createpriodForm.get("priods");
    if (e.target.value <= 9) {
      if (e.target.value == "") {
        (data as FormArray).controls = [];
      } else {
        for (let index = 0; index < e.target.value; index++) {
          const newarry = new FormGroup({
            priod_name: new FormControl("", [Validators.required]),
            from: new FormControl("", [Validators.required]),
            to: new FormControl("", [Validators.required])
          });
          //console.log(this.createpriodForm.get("priods"));

          (data as FormArray).push(newarry);
        }
      }
    } else {
      alert("Select a Number Between 1 to 9");
    }
  }

  createpriod(value) {
    console.log(value);
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    value.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}routine/add`, value, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.showloader = false;

        //this.classList = data.data;
      });
  }
}
