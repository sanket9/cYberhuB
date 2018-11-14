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
    this.title = new FormControl("", [Validators.required]);
    this.subject = new FormControl("", [Validators.required]);
    this.text = new FormControl("", [Validators.required]);
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

    console.log(this.slFile);

    let fd = new FormData();
    fd.append("file", this.slFile);

    var info = {
      sampleData: "abc",
      sampleInt: 123
    };

    fd.append('data', JSON.stringify(info));

    // fd.append("notice_type_id", "1");
    // fd.append("status", "1");
    // fd.append("user_master_id", "7");
    // fd.append("org_master_id", "1");
    // fd.append("user_type_id", "2");
    // fd.append("dept_id", "3");
    // fd.append("create_by", "1");
    // fd.append("is_Parent", "1");
    // fd.append("title", addNoticeFormData.title);
    // fd.append("subject", addNoticeFormData.subject);
    // fd.append("text", addNoticeFormData.text);

    console.log(JSON.stringify(fd));
    
    // this.http.post("http://softechs.co.in/fileupload.php", fd)
    //     .subscribe(data => {
    //       // let jsonResponse = data.json();
    //       console.log('Got some data from backend ', data);
    //       // console.log("Got some data from backend ", jsonResponse);
    //     }, (error) => {
    //       console.log('Error! ', error);
    // });
  }




  onSelectFile(e) {
    if (e.target.files && e.target.files[0]) {
      this.slFile = e.dataTransfer
        ? e.dataTransfer.files[0]
        : e.target.files[0];

      // console.log(this.slFile);
      // let fd = new FormData();
      // fd.append("selectFile", this.slFile, this.slFile.name);
    }


    // let elem = e.target;

    // if (elem.files.length > 0) {
    //   // let formData = new FormData();
    //   // formData.append('file', elem.files[0]);
    //   this.slFile = elem.files[0];
    // }
  }

}
