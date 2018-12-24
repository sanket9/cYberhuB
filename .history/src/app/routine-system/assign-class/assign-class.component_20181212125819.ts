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
import { log } from 'util';
@Component({
  selector: "app-assign-class",
  templateUrl: "./assign-class.component.html",
  styleUrls: ["./assign-class.component.scss"]
})
export class AssignClassComponent implements OnInit {
  showloader: any;
  classList: any;
  newclassList: any;
  shifs: any;
  proidList: any;
  subjects: any;
  weak: any = [
    {
      id: 1,
      name: "MON"
    },
    {
      id: 2,
      name: "TUE"
    },
    {
      id: 3,
      name: "WED"
    },
    {
      id: 4,
      name: "THU"
    },
    {
      id: 5,
      name: "FRI"
    },
    {
      id: 6,
      name: "SAT"
    },
    {
      id: 7,
      name: "SUN"
    }
  ];
  teachers: any = [];
  classlist;
  routineForm: FormGroup;
  days: FormArray;
  proids: FormArray;
  qtd = [];
  constructor(
    public http: Http,
    // public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.getClass();
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    //const element = array[index];
    this.days = new FormArray(
      [
        (this.proids = new FormArray(
          [
            new FormGroup({
              subject_id: new FormControl("", [Validators.required]),
              teacher_id: new FormControl("", [Validators.required])
            })
          ],
          [Validators.required]
        ))
      ],
      [Validators.required]
    );
  }
  createFormGroup() {
    this.routineForm = new FormGroup({ days: this.days });
  }

  datas() {
    console.log(this.qtd);
  }


  getClass() {
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { org_id: status[0].org_code };
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}classsection/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.classList = data.data;
        this.showloader = false;
      });
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.shifs = data.data;
      });
    this.http
      .post(`${environment.apiUrl}coursecat/getcoursesubject`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.showloader = false;

      });
  }

  selectAllShifts(e) {
    //console.log(e);
    this.classlist = [];
    this.newclassList = this.classList.filter(data => {
      return data.org_shift_id == e.value;
    });
    this.newclassList.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    console.log(this.classlist);
  }
  classChange(e){
    console.log(e);
    
  }
  // classChange(e) {
  //   // console.log(e.value);
  //   this.showloader = true;
  //   var headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   let options = new RequestOptions({ headers: headers });
  //   var status = this.SessionStore.retrieve("user-data");
  //   let data = { org_id: status[0].org_code };
  //   this.http
  //     .post(`${environment.apiUrl}routine/all`, data, options)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       //console.log(data);
  //       this.proidList = data.data;
  //     });
  //   let datatosend = { org_id: status[0].org_code, class_id: e.value };
  //   this.http
  //     .post(`${environment.apiUrl}subject/getbyClass`, datatosend, options)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       //this.showloader = false;
  //       // console.log(data);
  //       this.subjects = data.data;
  //       let depts = [];
  //       data.data.forEach(element => {
  //         if (depts.indexOf(element.dept_id) == -1) {
  //           depts.push(element.dept_id);
  //         }
  //       });
  //       console.log(depts);
  //       for (let index = 0; index < depts.length; index++) {
  //         const element = depts[index];
  //         let data = { dept_id: depts[index], org_id: status[0].org_code };
  //         this.http
  //           .post(`${environment.apiUrl}staff/teacher-search`, data, options)
  //           .map(res => res.json())
  //           .subscribe(data => {
  //             this.showloader = false;
  //             //console.log(data);
  //             if (data.data) {
  //               this.teachers.push(data.data);
  //               this.showloader = false;
  //             }
  //             console.log(this.teachers);
  //           });
  //       }
  //       //console.log(this.teachers);
  //     });
  // }

  onPriodselect(e) {
    //console.log(e.target.value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    let data = {
      dept_id: e.target.value,
      org_id: status[0].org_code
    };

    // this.http
    //   .post(`${environment.apiUrl}staff/teacher-search`, data, options)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     this.showloader = false;
    //     console.log(data);
    //     if (data.data) {
    //       this.teachers = data.data;
    //       // return data.data;
    //     }
    //     //this.subjects = data.data;
    //   });
  }
}