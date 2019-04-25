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
  depts: any;
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
  coursesubjects: any;
  classlist;
  routineForm: FormGroup;
  dept_teachers: FormArray;
  org_rooms: any;
  org_priods: any;
  yearList: any;
  qtd = [];
  rutineDetails;
  allsems;
  Finaldepts;
  remainClass;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.getClass();
    // this.createFormControl();
    this.createFormGroup();
    this.nexttenYear();
  }

  // createFormControl() {
  //   //const element = array[index];
  //   this.days = new FormArray(
  //     [
  //       (this.proids = new FormArray(
  //         [
  //           new FormGroup({
  //             subject_id: new FormControl("", [Validators.required]),
  //             teacher_id: new FormControl("", [Validators.required])
  //           })
  //         ],
  //         [Validators.required]
  //       ))
  //     ],
  //     [Validators.required]
  //   );
  // }

  createFormGroup() {
    this.routineForm = new FormGroup({
      shift: new FormControl("", [Validators.required]),
      day: new FormControl("", [Validators.required]),
      stream: new FormControl("", [Validators.required]),
      priod_id: new FormControl("", [Validators.required]),
      year: new FormControl("", [Validators.required]),
      sem: new FormControl("", [Validators.required]),
      dept_teachers: new FormArray([
        new FormGroup({
          component_name: new FormControl("", [Validators.required]),
          dept_id: new FormControl("", [Validators.required]),
          teacher_id: new FormControl("", [Validators.required]),
          room_id: new FormControl("", [Validators.required])
        })
      ])
    });
  }
  nexttenYear() {
    var min = new Date().getFullYear();
    var max = min + 9;
    this.yearList = [];
    for (var i = min; i <= max; i++) {
      this.yearList.push(i);
    }
  }

  addMoreItems() {
    // console.log("hii");
    let newarry = new FormGroup({
      dept_id: new FormControl("", [Validators.required]),
      teacher_id: new FormControl("", [Validators.required]),
      room_id: new FormControl("", [Validators.required])
    });

    let data = this.routineForm.get("dept_teachers");
    (data as FormArray).push(newarry);
    console.log(this.routineForm.value);
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
      .post(`${environment.apiUrl}coursecat/allsubcours`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.data) {
          this.coursesubjects = [];
          data.data.forEach(element => {
            if (this.coursesubjects.indexOf(element.count_name) < 0) {
              this.coursesubjects.push(element.count_name);
            }
          });
        }
        // console.log(this.coursesubjects);

        this.showloader = false;
      });
    this.http
      .post(`${environment.apiUrl}room/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.org_rooms = data.data;
      });
    this.http
      .post(`${environment.apiUrl}classsection/getallsem`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.allsems = data.data;
      });
  }

  selectAllShifts(e) {
    console.log(e);
    this.classlist = [];
    this.newclassList = this.classList.filter(data => {
      return data.org_shift_id == e.value;
    });
    this.newclassList.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    // console.log(this.newclassList);
    var status = this.SessionStore.retrieve("user-data");
    let routinedata = { org_id: status[0].org_code, shift_id: e.value };
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}routine/all`, routinedata, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.org_priods = data.data;
      });
  }
  classChange(e) {
    // console.log(e);
    let depts = this.newclassList.filter(
      itm => itm.class.class_name === e.value
    );
    this.depts = depts;
    console.log(this.depts);
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

  onDeptselect(e) {
    // console.log(e);
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    var status = this.SessionStore.retrieve("user-data");
    const selectedclass = this.depts.filter(itm => itm.id == e.value);

    let data = {
      dept_id: selectedclass[0].section.dept_id,
      org_id: status[0].org_code
    };
    let apidata = {
      dept_id: selectedclass[0].section.dept_id,
      org_id: status[0].org_code
    };
    this.http
      .post(`${environment.apiUrl}staff/teacher-search`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        if (data.data) {
          this.teachers = data.data;
          this.http
            .post(`${environment.apiUrl}coursecat/getsubcource`, apidata, options)
            .map(res => res.json())
            .subscribe(data => {
              console.log(data);
              
            });
          // return data.data;
        }
        //this.subjects = data.data;
      });
  }
  onSemselect($e) {
    this.Finaldepts = this.depts.filter(itm => itm.sem_id == $e.value);
  }

  submitForm(values: any) {
    console.log(values);
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    values.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}routine/createroutine`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        if (!data.error && data.data) {
          this.remainClass -= 1;
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Routine data Added."
          );
          this.getRoutine();
          // this.r0outineForm.reset();

          // this.router.navigate(["/event/index"]);
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong."
          );
        }
        //this.subjects = data.data;
      });
  }

  getRoutine() {
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      org_id: status[0].org_code,
      stream: this.routineForm.value.stream,
      year: this.routineForm.value.year
    };
    this.http
      .post(`${environment.apiUrl}routine/getbyorg`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        let new_arry = [];
        data.data.forEach((element, i) => {
          let pos = new_arry
            .map(function(e) {
              return e.day;
            })
            .indexOf(element.day);
          // console.log(new_arry.indexOf(element.day));
          if (pos < 0) {
            let new_data = {
              id: element.id,
              day: element.day,
              priods: [
                {
                  priod_id: element.priod_id,
                  rutinedetails: element.rutinedetails
                }
              ]
            };
            new_arry.push(new_data);
          } else {
            let exsisting_data = {
              priod_id: element.priod_id,
              rutinedetails: element.rutinedetails
            };
            new_arry[pos].priods.push(exsisting_data);
          }
        });
        this.rutineDetails = new_arry;
        console.log(this.rutineDetails);
      });
  }

  teacherOnchange($e) {
    let teacher = this.teachers.filter(data => data.id == $e.value);
    let {
      week_total_count_class,
      assigned_week_total_count_class
    } = teacher[0];
    let remain = week_total_count_class - assigned_week_total_count_class;
    this.remainClass = remain;
  
    //console.log(week_total_count_class, assigned_week_total_count_class);
  }
}
