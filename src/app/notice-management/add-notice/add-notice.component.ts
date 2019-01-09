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
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-notice",
  templateUrl: "./add-notice.component.html",
  styleUrls: ["./add-notice.component.scss"]
})
export class AddNoticeComponent implements OnInit {
  // title: string = null;
  // subTitle: string = null;
  // description: string = null;
  showloader: boolean = false;
  addNoticeForm: FormGroup;
  title: FormControl;
  subject: FormControl;
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
    console.log("sent from filter page : ", this.shareData);
    console.log("session value : ", this.sessionValue);
  }




// ########################################################################
// ----------- Creating form control -----------
// ########################################################################
  createFormControls() {
    this.title = new FormControl("", [Validators.required]);
    this.subject = new FormControl("", [Validators.required]);
    this.text = new FormControl("", [Validators.required]);
    // this.file_url = new FormControl("", []);
  }





// ########################################################################
// ----------- Creating form group -----------
// ########################################################################
  createFormGroup() {
    this.addNoticeForm = new FormGroup({
      title: this.title,
      subject: this.subject,
      text: this.text
      // file_url: this.file_url
    });
  }






// ########################################################################
// ----------- Notice submit method -----------
// ########################################################################
  onAddNoticeSubmit() {
    this.showloader = true;
    let addNoticeFormData = this.addNoticeForm.value;

    console.log('selected file : ', this.file);

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
    fd.append("file", this.file);

    console.log(fd);

    this.http.post(`${environment.apiUrl}notice/addnotice`, fd).map((res)=>res.json())
    .subscribe(data => {
      console.log('Got some data from backend ', data);
      if(data){
        this.showloader = false;
        this.notification.showNotification(
          "top",
          "right",
          "success",
          "Success, Notice Added Successfully."
        );
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
  }




// ########################################################################
// ----------- After choosing file -----------
// ########################################################################
  onSelectFile($event): void {
    var inputValue = $event.target;
    this.file = inputValue.files[0];
    // console.debug("Input File name: " + this.file.name + " type:" + this.file.type + " size:" + this.file.size);
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
}
