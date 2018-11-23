import { Component, OnInit } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { ApiService } from "../../services/api/api.service";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { environment } from "../../../environments/environment.prod";
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
    private sessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.sessionValue = this.sessionStore.retrieve('user-data');
    this.showDescription = false;
    this.showFileUpload = false;
    this.apiServ.serviceData.subscribe(data => this.data = data);
    this.createFormControls();
    this.createFormGroup();
    this.multipartItem.formData = null;
    this.shareData = this.data;
    this.shareDataArrayObject = {};
    console.log("sent from filter page : ", this.shareData);
    // console.log("session value : ", this.sessionValue);
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
    let addNoticeFormData = this.addNoticeForm.value;

    // console.log(this.file);

    let header = new Headers();
    header.append('Content-Type', 'multipart/form-data');

    this.shareDataArrayObject.secArr = this.shareData.sections;
    this.shareDataArrayObject.shiftArr = this.shareData.shifts;

    let fd = new FormData();

    fd.append("notice_type_id", this.shareData.noticeType);
    // fd.append("status", "1");
    fd.append("create_by", this.sessionValue[0].master_id);
    fd.append("org_id", this.sessionValue[0].org_code);
    // fd.append("user_type_id", "1");
    fd.append("dept_id", JSON.stringify(this.shareDataArrayObject.secArr));
    fd.append("org_shift_id", JSON.stringify(this.shareDataArrayObject.shiftArr));
    // fd.append("create_by", this.shareData.);    
    fd.append("title", addNoticeFormData.title);
    fd.append("subject", addNoticeFormData.subject);
    fd.append("text", addNoticeFormData.text);

    console.log(fd);

    this.http.post(`${environment.apiUrl}notice/addnotice`, fd).map((res)=>{res.json()})
    .subscribe(data => {
      console.log('Got some data from backend ', data);
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
    }else{
      this.showFileUpload = true;
      this.showDescription = false;
    }
  }
}
