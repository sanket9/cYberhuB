import { Component, OnInit } from "@angular/core";
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
import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment'
@Component({
  selector: "app-view-rutine",
  templateUrl: "./view-rutine.component.html",
  styleUrls: ["./view-rutine.component.scss"]
})
export class ViewRutineComponent implements OnInit {
  showloader: any;
  classList: any;
  newclassList: any;
  shifs: any;
  depts: any;
  subjects: any;
  coursesubjects: any;
  allsems;
  viewRoutine: FormGroup;
  classlist;
  yearList;
  Finaldepts;
  rutineDetails;
  org_priods;
  samname;
  deptName;
  modele_id = 6;
  filterRole;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.getClass();
    this.nexttenYear();
    this.getRole()
  }

  createFormGroup() {
    this.viewRoutine = new FormGroup({
      shift: new FormControl("", [Validators.required]),
      stream: new FormControl("", [Validators.required]),
      year: new FormControl("", [Validators.required]),
      sem: new FormControl("", [Validators.required]),
      dept_id: new FormControl("", [Validators.required])
    });
  }
  getRole() {
    var role = this.SessionStore.retrieve('user-role');
    // console.log(role);

    // role = JSON.parse(role);
    let filterRole = role.filter(ele => ele.module_id == this.modele_id);
    if (filterRole.length > 0) {
      this.filterRole = filterRole[0]
    }
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
      .post(`${environment.apiUrl}classsection/getallsem`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.allsems = data.data;
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
  deptChange(e) {
    this.deptName = this.Finaldepts.filter(item => item.id == e.value);
    console.log(this.deptName[0].section.sec_name);
  }
  selectAllShifts(e) {
    // console.log(e);
    this.classlist = [];
    this.newclassList = this.classList.filter(data => {
      return data.org_shift_id == e.value;
    });
    this.newclassList.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
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
    this.viewRoutine.patchValue({
      stream: '',
      year: '',
      sem: '',
      dept_id: ''
    })
  }
  classChange(e) {
    // console.log(e);
    let depts = this.newclassList.filter(
      itm => itm.class.class_name === e.value
    );
    this.depts = depts;
    this.viewRoutine.patchValue({
      year: '',
      sem: '',
      dept_id: ''
    })
    // console.log(this.depts);
  }
  onSemselect($e) {
    this.Finaldepts = this.depts.filter(itm => itm.sem_id == $e.value);
    this.samname = this.allsems.filter(itm => itm.id == $e.value);
    console.log(this.samname);
    this.viewRoutine.patchValue({

      dept_id: ''
    })
  }
  submitForm(values) {
    console.log(values);
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    values.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}routine/getroutineforDept`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.showloader = false;
        if (data.data) {
          
          // this.allsems = data.data;
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
                    priod_name: element.priod.period_name,
                    rutinedetails: element.rutinedetails
                  }
                ]
              };
              new_arry.push(new_data);
            } else {
              let exsisting_data = {
                priod_id: element.priod_id,
                priod_name: element.priod.period_name,
                rutinedetails: element.rutinedetails
              };
              new_arry[pos].priods.push(exsisting_data);
            }
          });
          this.rutineDetails = new_arry;
          console.log(this.rutineDetails);
        }
        
      });
  }
  datecompare(date) {
    var examdate = moment(date)
    var now = moment();

    if (now > examdate) {
      console.log("here");
      
      // date is past
      return false
    } else {
      // date is future
      return true
    }
  }
  printit() {
    let divToPrint = document.getElementById("printtable").innerHTML;
    let newWindow = window.open(
      "",
      "_blank",
      "top=0,left=0,height=100%,width=auto"
    );
    newWindow.document.open();
    newWindow.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            @media print {
                .routine {
                    border-collapse: collapse;
                }
            }
            @page { size: landscape; }
          </style>
        </head>
        <body onload="window.print();window.close()">${divToPrint}   
        </body>
      </html>
    `);
    newWindow.document.close();
  }

  getDay = id => {
    let week = [
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

    let day = week.map(itm => {
      if (itm.id == id) {
        return itm.name;
      }
    });
    if (day) {
      let x = day.filter(ele => {
        return ele != undefined;
      });
      return x;
    }
  };
}
