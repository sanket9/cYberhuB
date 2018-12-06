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
@Component({
  selector: "app-subject-add",
  templateUrl: "./subject-add.component.html",
  styleUrls: ["./subject-add.component.scss"]
})
export class SubjectAddComponent implements OnInit {
  showloader: boolean = false;
  classList: any;
  addSubjectForm: FormGroup;
  subjects: FormArray;
  class_id;
  subject_name;
  subjectlist;
  depts: any;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
    this.getClass();
  }

  createFormControl() {
    this.subjects = new FormArray([new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required]),
          dept_id: new FormControl("", [Validators.required])
        }), new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required]),
          dept_id: new FormControl("", [Validators.required])
        }), new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required]),
          dept_id: new FormControl("", [Validators.required])
        })], [Validators.required]);
  }
  createFormGroup() {
    this.addSubjectForm = new FormGroup({ subjects: this.subjects });
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

              let data = {
                id: ele.id,
                shift: ele.class.org_shift.shifts.name,
                class_id: ele.class_id,
                class: ele.class.section.sec_name,
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
              subjectname: [{
                sub_name: ele.subject_name,
                id: ele.id
              }]
            };

            this.subjectlist.push(data);
          }
        });

        //console.log('subject list : ', this.subjectlist);
      });
  }
  increaseField() {
    const newarry = new FormGroup({
      class_id: new FormControl("", [Validators.required]),
      subject_name: new FormControl("", [Validators.required])
    });
    let data = this.addSubjectForm.get("subjects");
    (data as FormArray).push(newarry);
    // console.log(this.addSubjectForm);
  }

  addSubject(values) {
    this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    values.org_id = status[0].org_code;
    this.http
      .post(`${environment.apiUrl}subject/add`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Subjects Added SuccessFuly"
          );
          this.getClass();
          this.addSubjectForm.reset();
          //this.router.navigate(["/library/index"]);
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong"
          );
        }
        this.showloader = false;
      });
  }
  deleteClass(id){
    if (confirm("Are want to Delete this")){
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({ headers: headers });
      var status = this.SessionStore.retrieve("user-data");
      let values = {
        id
      }
      this.http
        .post(`${environment.apiUrl}subject/delete`, values, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (!data.error && data.data) {
            this.notification.showNotification("top", "right", "success", "Subjects Deleted SuccessFuly");
            this.getClass();
            //this.router.navigate(["/library/index"]);
          } else {
            this.notification.showNotification("top", "right", "warning", "Something Went Wrong");
          }
          this.showloader = false;
        });
    }    
  }
}
