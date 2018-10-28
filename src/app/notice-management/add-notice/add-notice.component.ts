import { Component, OnInit } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { ApiService } from "../../services/api/api.service";
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

  slFile: File;

  constructor(
    public router: Router,
    public http: Http,
    private apiServ: ApiService
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  createFormControls() {
    this.title = new FormControl("", []);
    this.subject = new FormControl("", []);
    this.text = new FormControl("", []);
    // this.file_url = new FormControl("", []);
  }

  createFormGroup() {
    this.addNoticeForm = new FormGroup({
      title: this.title,
      subject: this.subject,
      text: this.text
      // file_url: this.file_url
    });
  }

  onAddNoticeSubmit() {
    let addNoticeFormData = this.addNoticeForm.value;
    let fd = new FormData();
    fd.append("file", this.slFile, this.slFile.name);
    fd.append("notice_type_id", "1");
    fd.append("status", "1");
    fd.append("user_master_id", "7");
    fd.append("org_master_id", "1");
    fd.append("user_type_id", "2");
    fd.append("dept_id", "3");
    fd.append("create_by", "1");
    fd.append("is_Parent", "1");
    fd.append("title", addNoticeFormData.title);
    fd.append("subject", addNoticeFormData.subject);
    fd.append("text", addNoticeFormData.text);

    // addNoticeFormData.notice_type_id = 1;
    // addNoticeFormData.status = 1;
    // addNoticeFormData.user_master_id = 7;
    // addNoticeFormData.org_master_id = 1;
    // addNoticeFormData.user_type_id = 2;
    // addNoticeFormData.dept_id = 2;
    // addNoticeFormData.dept_id = 3;
    // addNoticeFormData.create_by = 1;
    // addNoticeFormData.is_Parent = 1;
    // addNoticeFormData.file_url = this.slFile;

    // let body = JSON.stringify(addNoticeFormData);
    // console.log(addNoticeFormData);
    console.log(fd);

    this.apiServ.addNotice(fd).subscribe((res: any) => {
      console.log("Responce From Server : ", res);
    });
  }

  onSelectFile(e) {
    if (e.target.files && e.target.files[0]) {
      this.slFile = e.dataTransfer
        ? e.dataTransfer.files[0]
        : e.target.files[0];
      // console.log(file);
      // let fd = new FormData();
      // fd.append("selectFile", file, file.name);
      // this.slFile = fd;
      // console.log(this.slFile);
    }
  }

  // onSelectFile(files: any) {
  //   console.log(files[0]);
  //   this.myFile = <File>files[0];
  // }
}
