import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { NotificationService } from '../services/notification.service'
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { environment } from "../../environments/environment.prod";
import { Chart } from 'chart.js';

import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray,
} from "@angular/forms";

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {
  @ViewChild("doughnutCanvas") doughnutCanvas;
  doughnutChart: any;

  org_id: any;
  username: any
  userData: any;
  userdetailsFrm: FormGroup;
  showLoader: boolean;
  chartClassList = [];
  chartAttdValue = [];
  chartcolor = [];
  avgAtdence: number;

  backgroundColor = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 206, 86)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
    "rgb(66, 134, 244)",
    "rgb(190, 71, 255)"
  ];
  showloader: boolean;
  classList: any;
  shifs: any;
  coursesubjects: any[];
  allsems: any;
  classlist: any[];
  newclassList: any;
  Finaldepts: any;
  depts: any;
  samname: any;
  yearList: any[];
  constructor(
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService,
  ) { }

  ngOnInit() {
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.getClass();
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
        this.showLoader = false;
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

  selectAllShifts(e, isevent) {
    // console.log('..................>>>>>>',e);
    this.classlist = [];
    this.newclassList = this.classList.filter(data => {
      return data.org_shift_id == e;
    });
    this.newclassList.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    if (isevent) {
      this.userdetailsFrm.patchValue({
        class_id: '',
        class_year: '',
        sem: '',
        dept_id: ''
      })
      
    }
    // this.userdetailsFrm.controls['class_id'].setValue(this.userData.studentmaster.nameclass.class.class_name);
    // console.log('..................>>>>>>',this.classlist  );
  }
  classChange(e, isevent) {
    // console.log(e);
    let depts = this.newclassList.filter(
      itm => itm.class.class_name === e
    );
    this.depts = depts;
    if (isevent) {
      this.userdetailsFrm.patchValue({
        class_year: '',
        sem: '',
        dept_id: ''
      })
      
    }
    // console.log(this.depts);
  }
  onSemselect($e, isevent) {
    this.Finaldepts = this.depts.filter(itm => itm.sem_id == $e);
    this.samname = this.allsems.filter(itm => itm.id == $e);
    console.log(this.samname);
    if (isevent) {
      this.userdetailsFrm.patchValue({
        dept_id: ''
      })
      
    }
  }

  nexttenYear() {
    var min = new Date().getFullYear();
    var max = min + 5;
    this.yearList = [];
    for (var i = min; i <= max; i++) {
      this.yearList.push(i);
    }
  }

  deptChange(value, isevent) {
    console.log(value);
    
  }

  getUserDetails() {

    if (this.checkUsername()) {
      this.showloader = true;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({ headers: headers });
      let apidata = {
        org_id: this.org_id,
        username: this.username
      }

      this.http
        .post(`${environment.apiUrl}search/user`, apidata).map(res => res.json())
        .subscribe(data => {
          // console.log(data);
          this.showloader = false;
          if (data.data) {
            this.chartClassList = [];
            this.chartAttdValue = [];
            this.chartcolor = [];
            this.userData = data.data;
            let api = {
              id : this.userData.master_id
            }
            // this.http
            // .post(`${environment.apiUrl}parent/student`, api).map(res => res.json())
            // .subscribe(responce => {
            //   console.log(responce);
              
            // })

            
            this.createfromcontrol();
            this.getAttendanceDetails(this.userData.studentmaster.class_id, this.userData.master_id)
          }else{
            this.notification.showNotification(
              "top",
              "right",
              "danger",
              "No Student associate with this Username."
            );
          }
        })
    } else {
      this.notification.showNotification(
        "top",
        "right",
        "danger",
        "Not a valid Student username."
      );
    }

  }

  checkUsername() {
    let usernameSplited = this.username.toString().split('/')[0].toLowerCase();
    if (usernameSplited == 'std') {
      return true
    }
    return false
  }
  createfromcontrol() {
    if (this.userData.hasOwnProperty('stafftmaster')) {
      
      this.userdetailsFrm = new FormGroup({
        id: new FormControl(
          this.userData.master_id,
          // "aaa",
          [Validators.required]
        ),
        username: new FormControl(
          this.userData.username,
          // "aaa",
          [Validators.required]
        ),
        name: new FormControl(
          this.userData.stafftmaster.name,
          // "aaa",
          [Validators.required]
        ),
        phone: new FormControl(
          this.userData.stafftmaster.phone,
          // "aaa",
          [Validators.required]
        ),
  
        email: new FormControl(
          this.userData.stafftmaster.email,
          // "aaa",
          [Validators.required]
        ),
        
      });
    }else if (this.userData.hasOwnProperty('studentmaster')) {
      this.userdetailsFrm = new FormGroup({
        id: new FormControl(
          this.userData.master_id,
          // "aaa",
          [Validators.required]
        ),
        username: new FormControl(
          {value: this.userData.username, disabled: true},
          // "aaa",
          [Validators.required]
        ),
        name: new FormControl(
          this.userData.studentmaster.name,
          // "aaa",
          [Validators.required]
        ),
        phone: new FormControl(
          this.userData.mobile_no,
          // "aaa",
          [Validators.required]
        ),
  
        email: new FormControl(
          this.userData.studentmaster.email,
          // "aaa",
          [Validators.required]
        ),
        identity_no: new FormControl(
          this.userData.studentmaster.adhar_no,
          // "aaa",
          [Validators.required]
        ),
        address: new FormControl(
          this.userData.studentmaster.address,
          // "aaa",
          [Validators.required]
        ),
        std_postal_code: new FormControl(
          this.userData.studentmaster.std_postal_code,
          // "aaa",
          [Validators.required]
        ),
        dob: new FormControl(
          this.userData.studentmaster.dob,
          // "aaa",
          [Validators.required]
        ),
        gender: new FormControl(
          this.userData.studentmaster.gender,
          // "aaa",
          [Validators.required]
        ),
        cast_category: new FormControl(
          this.userData.studentmaster.cast_category,
          // "aaa",
          [Validators.required]
        ),
        roll_no: new FormControl(
          this.userData.studentmaster.roll_no,
          // "aaa",
          [Validators.required]
        ),
        registration_no: new FormControl(
          this.userData.studentmaster.registration_no,
          // "aaa",
          [Validators.required]
        ),
        shift_id: new FormControl(
          this.userData.studentmaster.shift_id,
          // "aaa",
          [Validators.required]
        ),
        class_id: new FormControl(
          '',
          // "aaa",
          [Validators.required]
        ),
        class_year: new FormControl(
          '',
          // "aaa",
          [Validators.required]
        ),
        sem: new FormControl(
          '',
          // "aaa",
          [Validators.required]
        ),
        dept_id: new FormControl(
          '',
          // "aaa",
          [Validators.required]
        ),
      });
      this.nexttenYear();      
      this.selectAllShifts(this.userData.studentmaster.shift_id, false);
      this.userdetailsFrm.controls['class_id'].setValue(this.userData.studentmaster.nameclass.class.class_name);
      this.userdetailsFrm.controls['class_year'].setValue(Number(this.userData.studentmaster.nameclass.year));
      
      this.classChange(this.userData.studentmaster.nameclass.class.class_name, false);
      this.userdetailsFrm.controls['sem'].setValue(this.userData.studentmaster.nameclass.sem_id);
      // console.log(this.userData.studentmaster.nameclass);
      
      this.onSemselect(this.userData.studentmaster.nameclass.sem_id, false);
      this.userdetailsFrm.controls['dept_id'].setValue(this.userData.studentmaster.nameclass.id);
      // console.log(this.userdetailsFrm.value);
      
      // this.userdetailsFrm.patchValue({
      //   class_id: this.userData.studentmaster.class_id,
      // })
    }
  }

  updateStudent() {
    let apidata =  this.userdetailsFrm.value;
    this.http
      .post(`${environment.apiUrl}search/update-std`, apidata).map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.status == 1) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Profile data Updated SuccessFuly"
          );
          this.getUserDetails()
        }
      })
  }


  updateclass() {
    let apidata = {
      id: this.userdetailsFrm.value.dept_id,
      std_id: this.userdetailsFrm.value.id
    }

    this.http
      .post(`${environment.apiUrl}student/classupdate`, apidata).map(res => res.json())
      .subscribe(data => {
        if (data.status == 1) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Profile data Updated SuccessFuly"
          );
          this.getUserDetails()
        }
      })
  }
  getAttendanceDetails(class_id, master_id) {
    this.showLoader = true;
    // console.log(this.chartAttdValue);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    let apidata = {
      org_id: this.org_id,
      dept_id: class_id,
      std_id: master_id     
    };

    this.http
      .post(
        `http://18.212.187.222:3000/attendance/getStudentAttnPercent`,
        apidata,
        options
      )
      .map(res => res.json())
      .subscribe(data => {
        // console.log("attn data : ", data);
        if (data.status) {
          this.showLoader = true;
          this.http
            .post(`${environment.apiUrl}coursecat/getsubcource`, apidata, options)
            .map(res => res.json())
            .subscribe(classes => {
              // console.log(classes);

              classes.data.forEach((element, i) => {
                let new_arry = [];
                new_arry = data.attd.filter(cls => {
                  return cls.class_sub_id == element.id;
                });

                if (new_arry.length == 0) {
                  this.chartAttdValue.push(0);
                  this.chartClassList.push(element.subject_name);
                  this.chartcolor.push(this.backgroundColor[i]);
                } else {
                  this.chartAttdValue.push(new_arry[0].percent);
                  this.chartClassList.push(element.subject_name);
                  this.chartcolor.push(this.backgroundColor[i]);
                }
                // this.showLoader = false;
              });

              let sum = this.chartAttdValue.reduce(
                (partial_sum, a) => partial_sum + a
              );

              this.avgAtdence = sum / this.chartAttdValue.length;

              if(this.chartAttdValue && this.chartAttdValue.length > 0){
                this.renderGraph();
              }else{
                this.showLoader = false;
              }
              
              console.log("attn data............. : ", data);
            });
            // this.showLoader = false;
        }      
      });
  }





  renderGraph() {   

    if(this.doughnutCanvas){
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: "bar",
        options: {
          legend: {
              display: false,
          }
        },
        data: {
          labels: this.chartClassList,
          datasets: [
            {
              data: this.chartAttdValue,
              backgroundColor: this.chartcolor
            }
          ]
        }
      });
    }   

    this.showLoader = false;
  }

}
