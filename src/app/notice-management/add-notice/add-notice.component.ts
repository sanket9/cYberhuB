import { Component, OnInit } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { ApiService } from "../../services/api/api.service";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { environment } from "../../../environments/environment.prod";
import { NotificationService } from '../../services/notification.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-notice",
  templateUrl: "./add-notice.component.html",
  styleUrls: ["./add-notice.component.scss"]
})
export class AddNoticeComponent implements OnInit {
  
  showloader: boolean = false;
  addNoticeForm: FormGroup;
  title: FormControl;
  subject: FormControl;
  startDate: FormControl;
  endDate: FormControl;
  text: FormControl;
  file_url: FormControl;
  file: File;
  multipartItem: any = {};
  uploadCallback: any;
  data: any;
  shareData: any;
  sessionValue: any;
  showDescription: boolean;
  showFileUpload: boolean;
  shareDataArrayObject: any;
  buttonName: string = "Save"
  schedule: FormArray;
  noti_date: FormControl
  noti_time: FormControl
  noti_title: FormControl
  noti_body: FormControl;
  // sscheduleNotice: FormGroup;
  schedulenotiForm: FormGroup;
  showNotificationPanel: boolean = false;
  // get data() {
  //   return this.apiServ.serviceData;
  // }
  // set data(value: string) {
  //   this.apiServ.serviceData = value;
  // }

  constructor(
    public router: Router,
    public http: Http,
    private apiServ: ApiService,
    private sessionStore: SessionStorageService,
    public notification: NotificationService
  ) {}

  ngOnInit() {
    this.sessionValue = this.sessionStore.retrieve("user-data");
    this.showDescription = false;
    this.showFileUpload = false;
    this.apiServ.serviceData.subscribe(data => this.data = data);
    this.createFormControls();
    this.createFormGroup();
    this.multipartItem.formData = null;
    this.shareData = this.data;
    this.shareDataArrayObject = {};
    // console.log("sent from filter page : ", this.shareData);
    // console.log("session value : ", this.sessionValue);
  }




// ########################################################################
// ----------- Creating form control -----------
// ########################################################################
  createFormControls() {
    this.title = new FormControl("", [Validators.required]);
    this.subject = new FormControl("", [Validators.required]);
    this.startDate = new FormControl("", [Validators.required]);
    this.endDate = new FormControl("", [Validators.required]);
    this.text = new FormControl("", [Validators.required]);
    // this.schedule =
    this.file_url = new FormControl("", []);
    // console.log(this.addNoticeForm.controls);
  }

  addSchedule(){
    let data = this.schedulenotiForm.get("schedule");
    if ((data as FormArray).length < 2) {
      
      const newarry = new FormGroup({
        noti_date: new FormControl("", [Validators.required]),
        noti_time: new FormControl("", [Validators.required]),
        noti_title: new FormControl("", [Validators.required]),
        noti_body: new FormControl("", [Validators.required]),
        
      });
      (data as FormArray).push(newarry);
    }else{
      this.notification.showNotification(
        "top",
        "right",
        "danger",
        "Maximum Number Scheduled Notification are Set."
      );
    }
    // console.log(this.addNoticeForm);
    
  }



// ########################################################################
// ----------- Creating form group -----------
// ########################################################################
  createFormGroup() {
    this.addNoticeForm = new FormGroup({
      title: this.title,
      subject: this.subject,
      startDate: this.startDate,
      endDate: this.endDate,
      text: this.text,
      // schedule: this.schedule
      file_url: this.file_url
    });
    let notiFrm =  new FormArray([
      new FormGroup({
        noti_date: new FormControl("", [Validators.required]),
        noti_time: new FormControl("", [Validators.required]),
        noti_title: new FormControl("", [Validators.required]),
        noti_body: new FormControl("", [Validators.required]),
      })  
    ]);
    this.schedulenotiForm = new FormGroup({
      schedule: notiFrm
    })
    // console.log(this.schedulenotiForm.controls);
  }
  goNext(){
    this.showNotificationPanel = true;
  }

  publishDate(e){
    // console.log();
    var d = new Date;
    var getdatestring = e.value.toDateString();
    getdatestring == d.toDateString() ? this.buttonName = 'Publish Now' : this.buttonName = 'Save'; 
    // console.log(this.buttonName);    
  }



// ########################################################################
// ----------- Notice submit method -----------
// ########################################################################
  onAddNoticeSubmit() {
    this.showloader = true;
    let addNoticeFormData = this.addNoticeForm.value;

    let header = new Headers();
    header.append("Content-Type", "multipart/form-data");

    this.shareDataArrayObject.secArr = this.shareData.sections;
    this.shareDataArrayObject.shiftArr = this.shareData.shifts;
    this.shareDataArrayObject.stuffArr = this.shareData.stuffs;
    this.shareDataArrayObject.stdArr = this.shareData.studentsArr;

    let fd = new FormData();

    fd.append("notice_type_id", this.shareData.noticeType);
    fd.append("create_by", this.sessionValue[0].master_id);
    fd.append("org_id", this.sessionValue[0].org_code);
    fd.append("dept_id", this.shareDataArrayObject.secArr);
    fd.append("org_shift_id", this.shareDataArrayObject.shiftArr);

    fd.append("stuff_id", this.shareDataArrayObject.stuffArr);
    fd.append("student_id", this.shareDataArrayObject.stdArr);

    fd.append("title", addNoticeFormData.title);
    fd.append("subject", addNoticeFormData.subject);
    fd.append("text", addNoticeFormData.text);
    fd.append("start_date", this.getFullDate(addNoticeFormData.startDate));
    fd.append("end_date", this.getFullDate(addNoticeFormData.endDate));
    fd.append("file", this.file);

    if (this.hasNull(addNoticeFormData)) {
      // console.log("hereeee");
      
      this.http.post(`${environment.apiUrl}notice/addnotice`, fd).map((res)=>res.json())
      .subscribe(data => {
        
        if(data){
            if (this.schedulenotiForm.value.schedule.length > 0) {
              let apiData = {
                org_id: this.sessionValue[0].org_code,
                type_id: data.data.id,
                shedule_type: 1,
                shedule_arry: this.schedulenotiForm.value.schedule
              };
              // console.log(apiData);
              
              this.http
                .post(`${environment.apiUrl}schedule/add`, apiData)
                .map(res => res.json())
                .subscribe(retundata => {
                  console.log(
                    "Got some data from backend ",
                    retundata
                  );
                  this.showloader = false;
                  this.notification.showNotification(
                    "top",
                    "right",
                    "success",
                    "Success, Notice Added Successfully."
                  );
                  this.addNoticeForm.reset();
                  this.router.navigate(['/notice']);
                });
              }
              this.notification.showNotification(
                "top",
                "right",
                "success",
                "Success, Notice Added Successfully."
              );
              this.router.navigate(['/notice']);
            
        }else{
          this.showloader = false;
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Sorry, Something Went Wrong."
          );
        }
        
      });
    }else{
      console.log(addNoticeFormData);
      
      this.showloader = false;
      this.notification.showNotification(
        "top",
        "right",
        "danger",
        "Sorry, Field is missing "
      );
    }

  }

// ########################################################################
// ----------- Null Checking -----------
// #######################################################################

  hasNull(target) {
    for (var member in target) {
      if (target[member] == null)
        console.log(target[member]);
        
        return true;
    }
    return false;
  }


// ########################################################################
// ----------- After choosing file -----------
// ########################################################################
  onSelectFile($event): void {
    var inputValue = $event.target;
    this.file = inputValue.files[0];
    console.log(this.file);
  }


  

// ########################################################################
// ----------- After choosing desc option method -----------
// ########################################################################
  onChooseDescType(e){
    if(e.value == "1"){
      this.showDescription = true;
      this.showFileUpload = false;
    } else {
      this.showFileUpload = true;
      this.showDescription = false;
    }
  }



  deleteNotificationCount() {
    if (confirm("Do you want to Delete this?")) {
      let data = this.schedulenotiForm.get("schedule");
      (data as FormArray).removeAt(1);
    }
  }
// ########################################################################
// ----------- get full year method -----------
// ########################################################################
  getFullDate(today) {
    // var today = new Date();
    if (today) {
      
      var dd = today.getDate().toString();
      var mm = today.getMonth().toString();
      var monthNum = mm + 1;
      var yyyy = today.getFullYear();
      // var returnDate;
  
      // console.log('length : ', dd.length);
      if (dd.length < 1) {   
        dd = '0' + dd;
        // console.log(dd);    
      }
  
      // console.log('length : ', monthNum.length);
      if (monthNum.length < 1) {
        monthNum = '0' + monthNum;
        // console.log(monthNum);
      }
  
      // console.log(yyyy + '-' + monthNum + '-' + dd);  
      return yyyy + '-' + monthNum + '-' + dd;    
    }
  }
}
