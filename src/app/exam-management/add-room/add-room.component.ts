import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective
} from "@angular/forms";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: "app-add-room",
  templateUrl: "./add-room.component.html",
  styleUrls: ["./add-room.component.scss"]
})
export class AddRoomComponent implements OnInit {
  roomaddForm: FormGroup;
  room_name: FormControl;
  floor_name: FormControl;
  seatingTypes: FormControl;
  banchtypes: FormControl;
  benchCapacity: FormControl;
  no_of_rows: FormControl;
  no_of_bench: FormControl;
  total_no_of_student: FormControl;
  showErrors: boolean = false;
  seating_types = [{ id: 1, name: "Table" }, { id: 2, name: "Bench" }];
  banch_types: any = [];
  bench_capacity: any = [];
  disabaleBanchType: boolean = true;
  showloader: boolean = false
  perBenchCapacity: number;
  total_no_student: number;
  seatingType: any;
  allFloors: any;

  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
    this.getallFloors();
    //this.seatingType = JSON.stringify([{ id: 1, name: "Table" }, { id: 2, name: "Banch" }]);
  }

  createFormControl() {
    this.room_name = new FormControl("", [Validators.required]);
    this.floor_name = new FormControl("", [Validators.required]);
    this.seatingTypes = new FormControl("", [Validators.required]);
    this.banchtypes = new FormControl({ value: "", disabled: true }, [
      Validators.required
    ]);
    this.no_of_rows = new FormControl({ value: "", disabled: true }, [
      Validators.required
    ]);
    this.benchCapacity = new FormControl("", [Validators.required]);
    this.no_of_bench = new FormControl("", [Validators.required]);
    this.total_no_of_student = new FormControl({ value: "", disabled: true }, [
      Validators.required
    ]);
  }

  createFormGroup() {
    this.roomaddForm = new FormGroup({
      room_name: this.room_name,
      floor_name: this.floor_name,
      seatingTypes: this.seatingTypes,
      banchtypes: this.banchtypes,
      benchCapacity: this.benchCapacity,
      no_of_rows: this.no_of_rows,
      no_of_bench: this.no_of_bench,
      total_no_of_student: this.total_no_of_student
    });
    // console.log(this.bookaddForm);
  }

  onChangeSheattingtype(e) {
    // console.log(e);
    if (e.value === 1) {
      this.roomaddForm.patchValue({
        banchtypes: ''
      })
      this.roomaddForm.controls["banchtypes"].disable();
      this.bench_capacity = [1];
      this.roomaddForm.controls["no_of_rows"].enable();
      // console.log(this.benchCapacity);
    } else {
      this.disabaleBanchType = false;
      this.roomaddForm.controls["banchtypes"].enable();
      this.banch_types = [{ id: 1, name: "Long" }, { id: 2, name: "Short" }];
    }
    this.roomaddForm.patchValue({
      no_of_bench: '',
      no_of_rows: '',
      total_no_student : ''
    })
  }
  noofBenchChange() {
    this.total_no_student =
      this.roomaddForm.value.benchCapacity * this.roomaddForm.value.no_of_bench;
  }
  onChangeBanchtype(e) {
    if (e.value === 1) {
      this.bench_capacity = [1, 2, 3];
    } else {
      this.bench_capacity = [1, 2];
    }
  }

  getallFloors() {
    this.http.get(`${environment.apiUrl}floor/getall`)
    .map(res => res.json()).subscribe((data: any) =>{
      // console.log(data);
      if (data.data) {
        this.allFloors = data.data
      }
      
    })
  }

  roomadd(values) {
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");

    if (values.banchtypes == 1) {
      values.banchtypes = "Long";
    } else {
      values.banchtypes = "Short";
    }

    if (values.seatingTypes == 1) {
      values.seatingTypes = "Table";
      values.banchtypes = null;
    } else {
      values.seatingTypes = "Bench";
      values.no_of_rows = null;
    }
    values.org_id = status[0].org_code;
    values.total_no_of_student = this.total_no_student;

    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}room/add`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Room Added SuccessFuly"
          );
          this.router.navigate(["/exam/index"]);
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong"
          );
        }
      });
  }
}
