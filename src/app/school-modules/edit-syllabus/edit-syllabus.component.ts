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
  selector: 'app-edit-syllabus',
  templateUrl: './edit-syllabus.component.html',
  styleUrls: ['./edit-syllabus.component.scss']
})
export class EditSyllabusComponent implements OnInit {
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
  org_id: any;
  id: string;
  apidatasyl: any;
  filename: string;
  file: any;


  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) { }

  ngOnInit() {
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.nexttenYear();
    this.getClass();
    this.createFormGroup();
    this.getSyllabusDetails()
  }


  createFormGroup() {
    this.viewRoutine = new FormGroup({
      shift: new FormControl(null , [Validators.required]),
      stream: new FormControl("", [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      sem: new FormControl(""),
      dept_id: new FormControl("", [Validators.required]),
      curriculum_year: new FormControl("", [Validators.required]),
      pdf_file: new FormControl("")
    });
  }   

  getSyllabusDetails() {
    this.showloader = true
    this.id = this.activeroute.snapshot.paramMap.get('id');
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { id:  this.id};
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}syllabus/get-one`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        this.apidatasyl = data.data[0]
        console.log(this.apidatasyl);
        setTimeout(() => {
          this.viewRoutine.patchValue({
            shift: this.apidatasyl.class.org_shift_id,
            curriculum_year: this.apidatasyl.curriculum_year,
            // year: Number(this.apidatasyl.class.year),
            
          });
          this.selectAllShifts(this.apidatasyl.class.org_shift_id)
          this.viewRoutine.patchValue({
            stream: this.apidatasyl.class.class.class_name,
            
          });
          this.classChange(this.apidatasyl.class.class.class_name);
          this.viewRoutine.patchValue({
            year: Number(this.apidatasyl.class.year),
            dept_id: this.apidatasyl.class.id
          });
          this.filename = this.apidatasyl.pdf_url;
          this.showloader = false
        }, 3000);
      })
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


  selectAllShifts(e) {
    // console.log(e);
    this.classlist = [];
    this.newclassList = this.classList.filter(data => {
      return data.org_shift_id == e;
    });
    this.newclassList.forEach(element => {
      if (this.classlist.indexOf(element.class.class_name) < 0) {
        this.classlist.push(element.class.class_name);
      }
    });
    var status = this.SessionStore.retrieve("user-data");
    let routinedata = { org_id: status[0].org_code, shift_id: e };
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
    console.log(e);
    let depts = this.newclassList.filter(
      itm => itm.class.class_name === e
    );
    this.depts = depts;
    this.viewRoutine.patchValue({
      year: '',
      sem: '',
      dept_id: ''
    })
    console.log(this.depts);
  }
  onSemselect($e) {
    this.Finaldepts = this.depts.filter(itm => itm.sem_id == $e.value);
    this.samname = this.allsems.filter(itm => itm.id == $e.value);
    console.log(this.samname);
    this.viewRoutine.patchValue({

      dept_id: ''
    })
  }
  selectImage(event) {
    let elem = event.target;
    if (elem.files.length > 0) {
      this.filename = elem.files[0].name;
      this.file = elem.files[0];

      this.viewRoutine.controls['pdf_file'].setValue(this.filename);
    }
  }


  uploadDetails() {

    let formData = new FormData();
    formData.append("org_id", this.org_id);
    formData.append("id", this.id);
    formData.append("class_id", this.viewRoutine.value.dept_id);
    formData.append("curriculum_year", this.viewRoutine.controls['curriculum_year'].value);
    if (this.file) {
      formData.append("pdf_url", this.file);
    }
    // console.log('formData...', this.org_id, this.class_id, this.viewRoutine.controls['curriculum_year'].value, this.file);
    
    this.http
      .post(`${environment.apiUrl}syllabus/update`, formData).map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.status == 1) {
          this.file = "";
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Syllabus Updated SuccessFuly"
          );
          this.router.navigate(['/school/module/syllabus/list'])
        }
      })
  }

}
