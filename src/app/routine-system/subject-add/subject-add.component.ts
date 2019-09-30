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
  classlist: any[];
  defaultclass: number;
  semId: any;
  defaultsubject: number;
  sortArray: any;
  orgClassSectionList: any;
  org_code: any;
  orgShiftLists: any;
  newsortArray: any;
  sortedSubjectList: any;
  semList: any;
  selectedClass_id: any;
  defaultyear: any;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.org_code = this.SessionStore.retrieve("user-data")[0].org_code;
    this.createFormControl();
    this.createFormGroup();
    this.getClass();
    this.getshift();
    this.getClassList();
    this.getAllSem();
  }

  createFormControl() {
    this.subjects = new FormArray([new FormGroup({
          // class_id: new FormControl("", [Validators.required]),
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
  increaseField() {
    const newarry = new FormGroup({
      // class_id: new FormControl("", [Validators.required]),
      subject_name: new FormControl("", [Validators.required]),
      dept_id: new FormControl("", [Validators.required])
    });
    let data = this.addSubjectForm.get("subjects");
    (data as FormArray).push(newarry);
    // console.log(this.addSubjectForm);
  }
  remoevField() {
    let data = this.addSubjectForm.get("subjects");    
    (data as FormArray).removeAt((data as FormArray).length - 1)
  }


  formArray() {
    let data = this.addSubjectForm.get("subjects");
    return (data as FormArray).length
  }
  addSubject(values) {
    console.log(values);
    if (this.sortedSubjectList && this.sortedSubjectList[0].id) {
      values.class_id = this.selectedClass_id;
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
    }else{
      alert('Complete the Above Selection Fields.')
    }
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
          if (data.data.class_id) {
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
    console.log(this.sortArray);
    this.sortArray.forEach(element => {
      console.log(element);
      
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    console.log(this.classlist);
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





  onChooseSem(e: any) {
    // this.defaultclass = -1;
    // this.semId = -1;
    this.defaultsubject = -1;
    var d = new Date();
    this.sortedSubjectList = this.newsortArray.filter(item => item.sem_id == e.value && item.year == d.getFullYear());
    console.log(this.sortedSubjectList);
    
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





  getCurrentYear() {
    var d = new Date();
    return d.getFullYear();
  }






  onChooseClassStream(e) {
    console.log(e);
    // let subs = this.subjectFrm.get("subject");
    // this.clearFormArray(subs as FormArray);
    this.selectedClass_id = e.value;    
  }




}
