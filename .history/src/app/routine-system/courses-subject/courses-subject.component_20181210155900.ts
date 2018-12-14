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

@Component({
  selector: "app-courses-subject",
  templateUrl: "./courses-subject.component.html",
  styleUrls: ["./courses-subject.component.scss"]
})
export class CoursesSubjectComponent implements OnInit {
  subjectFrm: FormGroup;
  subjectsArry: FormArray;
  org_code;
  orgClassSectionList;
  orgShiftLists;
  sortArray;
  classlist = [];
  subjectlist = [];
  showloader: boolean = false;
  compponents: any;
  constructor(
    public router: Router,
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.getshift();
    this.getClassList();
    this.subjectFrm = new FormGroup({ subject: new FormArray([]) });
    this.getcourcecat();
    this.allcoursesubject();
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
      });
  }
  onChooseShift(e) {
    this.classlist = [];
    // console.log(e);
    this.sortArray = this.orgClassSectionList.filter(
      itm => itm.org_shift.id == e.value
    );
    this.sortArray.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    console.log(this.classlist);
  }
  onChooseClass(e) {
    // 
    console.log(this.sortArray);
    this.sortArray = this.sortArray.filter(
      itm => itm.class.class_name === e.value
    );
    
  }
  onChooseClassStream(e) {
    // console.log(e);
    let subs = this.subjectFrm.get("subject");
    this.clearFormArray(subs as FormArray);

    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = { org_id: this.org_code, class_id: e.value };

    this.http
      .post(`${environment.apiUrl}subject/getbyClass`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        // console.log(data);
        if (data.data) {
          for (let index = 0; index < data.data.length; index++) {
            let frm_data = new FormGroup({
              sub_id: new FormControl(
                { value: data.data[index].id, disabled: true },
                [Validators.required]
              ),
              sub_name: new FormControl(
                { value: data.data[index].subject_name, disabled: true },
                [Validators.required]
              ),
              component_id: new FormControl("", [Validators.required])
            });
            //console.log(this.subjectFrm.value);
            let subs = this.subjectFrm.get("subject");
            (subs as FormArray).push(frm_data);
            //this.subjectsArry.push(frm_data);
          }
        }

        // console.log(this.subjectFrm.value)
      });
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };
  getcourcecat() {
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = { org_id: this.org_code };

    this.http
      .post(`${environment.apiUrl}coursecat/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);
        let arry = [];
        data.data.forEach(ele => {
          if (ele.parent_id == 0) {
            let data = {
              id: ele.id,
              name: ele.name,
              short: ele.short_name,
              subs: []
            };
            arry.push(data);
          } else if (ele.parent_id !== 0) {
            let data = { id: ele.id, name: ele.name, short: ele.short_name };
            let pr_id = ele.parent_id;
            arry.filter(itm => {
              if (itm.id == pr_id) {
                itm.subs.push(data);
              }
            });
          }
        });
        //
        this.compponents = arry;
        // console.log(arry);
      });
  }

  addForm(values) {
    values.controls.forEach((ele, i) => {
      // ele.controls.class_id.value
      values.value[i].sub_id = ele.controls.sub_id.value;
    });
    this.http
      .post(`${environment.apiUrl}coursecat/addcoursesubject`, values.value)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.status == 1) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Subjects Added SuccessFuly"
          );
          //this.getClass();
          this.subjectFrm.reset();
          this.allcoursesubject();
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

  allcoursesubject() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = { org_id: this.org_code };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}subject/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        console.log(data);

        // this.orgShiftLists = data.data;
        this.subjectlist = [];
        data.data.forEach(ele => {
          if (this.subjectlist.length > 0) {
            var filterData = this.subjectlist.filter(item => {
              return item.class_id == ele.class_id;
            });

            // console.log('filter data : ', filterData);

            if (filterData.length > 0) {
              // console.log("match found", filterData);
              let i = this.subjectlist.indexOf(filterData[0]);
              this.subjectlist.splice(i, 1);

              filterData[0].subjectname.push({
                sub_name: ele.subject_name,
                id: ele.id,
                course_cat: ele.subcourse[0]
              });
              this.subjectlist.push(filterData[0]);
            } else {
              let data = {
                id: ele.id,
                shift: ele.class.org_shift.shifts.name,
                class_id: ele.class_id,
                class: ele.class.section.sec_name,
                subjectname: [
                  {
                    sub_name: ele.subject_name,
                    id: ele.id,
                    course_cat: ele.subcourse[0]
                  }
                ]
              };

              this.subjectlist.push(data);
            }
          } else {
            let data = {
              id: ele.id,
              shift: ele.class.org_shift.shifts.name,
              class_id: ele.class_id,
              class: ele.class.section.sec_name,
              subjectname: [
                {
                  sub_name: ele.subject_name,
                  id: ele.id,
                  course_cat: ele.subcourse[0]
                }
              ]
            };

            this.subjectlist.push(data);
          }
        });
        console.log(this.subjectlist);
      });
  }

  deleteClass(class_id){
    //console.log(class_id);
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = { org_id: this.org_code, class_id };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}subject/deletesubjectcourse`, data)
      .map(res => res.json())
      .subscribe(data => {
        //this.showloader = false;
        //console.log(data);
        if (data.status == 1) {
          this.notification.showNotification("top", "right", "success", "Subjects Added SuccessFuly");
          this.allcoursesubject();
        } else {
          this.notification.showNotification("top", "right", "warning", "Something Went Wrong");
        }

      });
  }
}
