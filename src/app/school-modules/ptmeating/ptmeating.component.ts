import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { environment } from "../../../environments/environment.prod";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: 'app-ptmeating',
  templateUrl: './ptmeating.component.html',
  styleUrls: ['./ptmeating.component.scss']
})
export class PtmeatingComponent implements OnInit {

  public Editor = ClassicEditor;
  showloader: boolean;
  org_code: any;
  orgShiftLists: any;
  orgClassSectionList: any;
  classlist: any[];
  sortArray: any;
  newsortArray: any;

  dynamicArray: any = [];

  shiftDept:FormGroup;
  schedule: FormArray;
  ptmeetingInfo: FormGroup;
  forallornot: string;
  constructor(
    public router: Router,
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService
  ) { }

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.getshift();
    this.getClassList();
    this.createform()
  }

  
  getshift() {
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        this.orgShiftLists = data.data;
      });
  }
  getClassList() {
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}classsection/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        this.orgClassSectionList = data.data;
        this.createDynamicArray()
      });
  }

  createDynamicArray() {
    let pushArray = {
      orgShiftLists: this.orgShiftLists,
      classlist: [],
      deptList: []
    }
    this.dynamicArray.push(pushArray);
    console.log(this.dynamicArray);
    
  }

  createform() {
    this.schedule =  new FormArray([
      new FormGroup({
        shift: new FormControl("", [Validators.required]),
        class: new FormControl("", [Validators.required]),
        dept: new FormControl("", [Validators.required]),
        // noti_body: new FormControl("", [Validators.required]),
      })  
    ]);
    this.shiftDept = new FormGroup({
      schedule: this.schedule
    });
    this.ptmeetingInfo = new FormGroup({
      title: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      from_time: new FormControl("", [Validators.required]),
      to_time: new FormControl("", [Validators.required]),
      location: new FormControl("", [Validators.required]),
      agenda: new FormControl("", [Validators.required]),
    })
  }

  addMore(){
    let newFrom =  
      new FormGroup({
        shift: new FormControl("", [Validators.required]),
        class: new FormControl("", [Validators.required]),
        dept: new FormControl("", [Validators.required]),
      })  

    let subs = this.shiftDept.get("schedule");
    (subs as FormArray).push(newFrom);
    console.log(this.shiftDept);
    this.createDynamicArray();
  }

  onChooseShift(i,e) {

    
    this.classlist = [];

    this.sortArray = this.orgClassSectionList.filter(
      itm => itm.org_shift.id == e.value
    );
    console.log(this.sortArray);
    this.sortArray.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    this.dynamicArray[i].classlist = this.classlist
    console.log(this.classlist);
  }




  onChooseClass(i,e) {
    // this.defaultclass = -1;
    var d = new Date();

    console.log(this.sortArray);
    this.newsortArray = this.sortArray.filter(
      itm => itm.class.class_name === e.value && itm.year == d.getFullYear()
    );
    this.dynamicArray[i].deptList = this.newsortArray
  }

  validFormCheck() {
    if (this.forallornot =='all') {
      if (this.ptmeetingInfo.valid) {
        return true;
      }else{
        return false;
      }
    } if (this.forallornot == 'selected_dept') {      
      if (this.ptmeetingInfo.valid && this.shiftDept.valid) {
        return true;
      }else{
        return false;
      }
    }
  }
  savePtMeating() {
    this.showloader = true;
    let apiData = {
      org_id: this.org_code,
      created_by: this.SessionStore.retrieve("user-data")[0].master_id,
      ...this.ptmeetingInfo.value,
      ...this.shiftDept.value
    }
    console.log(apiData);
    this.http.post(`${environment.apiUrl}ptmeeting/add`, apiData)
    .map(res => res.json())
    .subscribe(data => {
      this.showloader = false;
      // console.log(data);
      if (data.data) {
        this.router.navigate(['/school/module/ptmeeting/list'])
        this.notification.showNotification(
          "top",
          "right",
          "success",
          "Added New Pt meeting"
        );
        
      }else{
        this.notification.showNotification(
          "top",
          "right",
          "warning",
          "Something Went wrong."
        );
      }

    })
    
  }
}
