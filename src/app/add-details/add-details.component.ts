import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'
import { ErrorStateMatcher } from '@angular/material/core';
import { NotificationService } from '../services/notification.service'
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
@Component({
  selector: "app-add-details",
  templateUrl: "./add-details.component.html",
  styleUrls: ["./add-details.component.css"]
})
export class AddDetailsComponent implements OnInit {
  showloader: boolean = false;
  orgShiftLists;
  shift_stdnt: any;
  shift_staff: any;
  shift_staff1: any;
  defaultclass: any;
  defaultclass1: any;
  semId: any;
  semId1: any;
  defaultsubject: any;
  defaultsubject1: any;
  classlist: any[];
  sortArray: any;
  orgClassSectionList: any;
  org_code: any;
  newsortArray: any;
  sortedSubjectList: any;
  selectedClass_id: any;
  semList: any;
  subjectlist: any;
  classList: any;
  depts: any;
  defaultyear: any;
  defaultyear1: any;
  yearList: any[];

  constructor(
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService,
    public router: Router
  ) {}

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.getShiftLists();
    this.getClassList();

    this.getClass();
    this.getshift();
    // this.getClassList();
    this.getAllSem();
  }

  uploadStudentFile(event) {    
    if (this.shift_stdnt == undefined) {
      this.notification.showNotification(
        "top",
        "right",
        "danger",
        "Please select Shift"
      );
    }else{

      this.showloader = true;
      let elem = event.target;
      if (elem.files.length > 0) {
        let formData = new FormData();
        formData.append("file", elem.files[0]);
        var status = this.SessionStore.retrieve("user-data");
        formData.append("org_id", status[0].org_code);
        formData.append("shift", this.shift_stdnt);
        formData.append("admission_year", this.defaultyear);
        formData.append("dept_id", this.defaultsubject);

        this.http
          .post(`${environment.apiUrl}student/addstudentexcel`, formData)
          .map(res => res.json())
          .subscribe(data => {
            this.showloader = false;
            if (data.status == 0) {
              this.notification.showNotification(
                "top",
                "right",
                "success",
                "Student data Added SuccessFuly"
              );
              //this.router.navigate(["/library/index"]);
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
  }



  uploadTeacherFile(event) {
    if (this.shift_staff == undefined) {
      this.notification.showNotification(
        "top",
        "right",
        "danger",
        "Please select Shift"
      );
    }else{

      this.showloader = true;
      let elem = event.target;
      if (elem.files.length > 0) {
        let formData = new FormData();
        formData.append("file", elem.files[0]);
        var status = this.SessionStore.retrieve("user-data");
        formData.append("org_id", status[0].org_code);
        formData.append("shift", this.shift_staff);
        this.http
          .post(`${environment.apiUrl}staff/addstaffexcel`, formData)
          .map(res => res.json())
          .subscribe(data => {
            this.showloader = false;
            if (data.status == 0) {
              this.notification.showNotification(
                "top",
                "right",
                "success",
                "Staff Data Added SuccessFuly"
              );
              //this.router.navigate(["/library/index"]);
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
  }

  downloadFile(url) {
    return this.http
      .get(url, {
        responseType: ResponseContentType.Blob
        //search: // query string if have
      })
      .map(res => {
        return { filename: url.indexOf("Staff.csv") > -1 ? "staff.csv" : "student.csv", data: res.blob() };
      })
      .subscribe(
        res => {
          // console.log("start download:", res);
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        error => {
          console.log("download error:", JSON.stringify(error));
        },
        () => {
          console.log("Completed file download.");
        }
      );
  }

  getShiftLists() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    var status = this.SessionStore.retrieve("user-data");

    let data = { org_id: status[0].org_code };

    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.orgShiftLists = data.data;
      });
  }



  onChooseShift(e) {
    this.defaultclass = -1;
    this.semId = -1;
    this.defaultsubject = -1;

    this.classlist = [];
    // this.class = "";
    this.defaultclass = -1;
    this.defaultsubject = -1;
    // console.log(e);
    this.sortArray = this.orgClassSectionList.filter(
      itm => itm.org_shift.id == e.value
    );

    // console.log(this.sortArray);
    this.sortArray.forEach(element => {
      // console.log(element);
      
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });

    // console.log(this.classlist);
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
      });
  }


  onChooseClass(e) {
    // this.defaultclass = -1;
    this.semId = -1;
    this.defaultsubject = -1;
    console.log(this.sortArray);
    this.newsortArray = this.sortArray.filter(
      itm => itm.class.class_name === e.value
    );
  }


  onChooseSem(e: any) {
    // this.defaultclass = -1;
    // this.semId = -1;
    this.defaultsubject = -1;
    var d = new Date();
    this.sortedSubjectList = this.newsortArray.filter(item => item.sem_id == e.value && item.year == d.getFullYear());
    console.log('subject list : ', this.sortedSubjectList);    
  }


  onChooseClassStream(e) {
    console.log(e);
    // let subs = this.subjectFrm.get("subject");
    // this.clearFormArray(subs as FormArray);
    this.selectedClass_id = e.value;    
  }


  getCurrentYear() {
    var d = new Date();
    return d.getFullYear();
  }


  getYearList(){
    let currentYear = this.getCurrentYear();

    this.yearList = [];
    this.yearList.push(currentYear);

    for (let index = 0; index < 6; index++) {
      --currentYear;
      this.yearList.unshift(currentYear);
    }

    return this.yearList;
  }


  getAllSem() {
    let data = {
      org_id: this.org_code
    };
    this.http
      .post(`${environment.apiUrl}classsection/getallsem`, data)
      .map(res => res.json())
      .subscribe(data => {
        console.log('sem list : .....', data);        
        this.semList = data.data;
      });
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
        // console.log(data);
        this.classList = data.data;
        this.http.get(`${environment.apiUrl}classsection/depts`).map(res => res.json())
        .subscribe(data=> {
           this.showloader = false;
           //console.log(data);
           this.depts = data.data;
        })
       
      });
    this.http
      .post(`${environment.apiUrl}subject/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {

        //console.log('my data : ', data.data);
        this.subjectlist = [];

        data.data.forEach(ele => {

          if(this.subjectlist.length > 0){

            var filterData = this.subjectlist.filter((item)=> {
              return item.class_id == ele.class_id;   
            });

            // console.log('filter data : ', filterData);

            if (filterData.length > 0) {
              // console.log("match found", filterData);
              let i = this.subjectlist.indexOf(filterData[0]);
              this.subjectlist.splice(i,1);

              filterData[0].subjectname.push({
                sub_name: ele.subject_name,
                id: ele.id
              });
              this.subjectlist.push(filterData[0]);

            } else {
              // console.log(ele);
              
              let data = {
                id: ele.id,
                shift: ele.class.org_shift.shifts.name,
                class_id: ele.class_id,
                class: ele.class.section.sec_name,
                year: ele.class.year,
                sem: ele.class.sem.sem_no,
                subjectname: [{
                  sub_name: ele.subject_name,
                  id: ele.id
                }]
              };

              this.subjectlist.push(data);
            }

          }else {

            let data = {
              id: ele.id,
              shift: ele.class.org_shift.shifts.name,
              class_id: ele.class_id,
              class: ele.class.section.sec_name,
              year: ele.class.year,
              sem: ele.class.sem.sem_no,
              subjectname: [{
                sub_name: ele.subject_name,
                id: ele.id
              }]
            };

            this.subjectlist.push(data);
          }
        });

        console.log('subject list : ', this.subjectlist);
      });
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

}
