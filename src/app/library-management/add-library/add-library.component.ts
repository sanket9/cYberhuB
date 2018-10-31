import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'
import { ErrorStateMatcher } from '@angular/material/core';
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: "app-add-library",
  templateUrl: "./add-library.component.html",
  styleUrls: ["./add-library.component.scss"]
})
export class AddLibraryComponent implements OnInit {
  bookaddForm: FormGroup;
  bookname: FormControl;
  authorname: FormControl;
  publishername: FormControl;
  isbn_code: FormControl;
  no_of_copy: FormControl;
  showErrors: boolean = false;

  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    this.bookname = new FormControl("", [Validators.required]);
    this.authorname = new FormControl("", [Validators.required]);
    this.publishername = new FormControl("", [Validators.required]);
    this.isbn_code = new FormControl("", [Validators.required]);
    this.no_of_copy = new FormControl("", [Validators.required]);
  }

  createFormGroup() {
    this.bookaddForm = new FormGroup({
      bookname: this.bookname,
      authorname: this.authorname,
      publishername: this.publishername,
      isbn_code: this.isbn_code,
      no_of_copy: this.no_of_copy
    });
    // console.log(this.bookaddForm);
  }

  bookadd(values) {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    values.org_id = 2;
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}library/addbook`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
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
      });
  }


  
}
