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
    this.subjects = new FormArray(
      [
        new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required])
        }),
        new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required])
        }),
        new FormGroup({
          class_id: new FormControl("", [Validators.required]),
          subject_name: new FormControl("", [Validators.required])
        })
      ],
      [Validators.required]
    );
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
        this.showloader = false;
      });
    this.http
      .post(`${environment.apiUrl}subject/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {

        console.log('my data : ', data.data);
        this.subjectlist = [];

        // data.data.forEach((ele, i) => {  
        //   // console.log('index : ', i);          
        //   if (i == 0) {
        //     let dta = { 
        //       id: ele.id,
        //       class_id: ele.class_id,
        //       class: ele.class.section.sec_name,
        //       subjectname: [ele.subject_name]
        //     };
        //     this.subjectlist.push(dta);
        //   }else{
        //     let arry = this.subjectlist.filter(data => {
        //       // console.log(data.class_id == ele.class_id);
              
        //       if(data.class_id == ele.class_id) {
        //         // console.log(ele);      
        //         data.subjectname.push(ele.subject_name);
        //       }else{
        //         let dta = {
        //           id: ele.id,
        //           class_id: ele.class_id,
        //           class: ele.class.section.sec_name,
        //           subjectname: [ele.subject_name]
        //         };
        //         // console.log("here", data);
        //         this.subjectlist.push(dta);
        //         //console.log(this.subjectlist);
        //       }

        //     })
        //     // console.log(arry);
            
        //   }
        // });
        // console.log('subject list : ', this.subjectlist);

        data.data.forEach(ele => {

          if(this.subjectlist.length > 0){

            let filterData = this.subjectlist.filter((item)=> {
              return item.class_id = ele.class_id;   
            });

            console.log('filter data : ', filterData);

            if (filterData.length > 0) {
              // console.log("match found", filterData);
              let i = this.subjectlist.indexOf(filterData[0]);
              this.subjectlist.splice(i,1);
              filterData[0].subjectname.push(ele.subject_name);
              this.subjectlist.push(filterData);

            } else {

              let data = {
                id: ele.id,
                class_id: ele.class_id,
                class: ele.class.section.sec_name,
                subjectname: [ele.subject_name]
              };

              this.subjectlist.push(data);
            }

          }else {

          let data = {
              id: ele.id,
              class_id: ele.class_id,
              class: ele.class.section.sec_name,
              subjectname: [ele.subject_name]
            };

            this.subjectlist.push(data);
          }
        });

        console.log('subject list : ', this.subjectlist);
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
            "Book Added SuccessFuly"
          );
          this.router.navigate(["/library/index"]);
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
}
