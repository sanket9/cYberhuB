import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ErrorStateMatcher } from "@angular/material/core";
import { NotificationService } from "../../services/notification.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.scss"]
})
export class EditBookComponent implements OnInit {
  bookeditForm: FormGroup;
  bookname: FormControl;
  authorname: FormControl;
  publishername: FormControl;
  isbn_code: FormControl;
  no_of_copy: FormControl;
  showErrors: boolean = false;
  routedData: any;
  constructor(
    private activated_route: ActivatedRoute,
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public location: Location
  ) {
      // console.log(this.router.url);
      // let url: string = this.router.url.substring(0, this.router.url.indexOf("?"));
      // this.router.navigateByUrl(url);
      
      this.activated_route.queryParams.subscribe(data => {
        this.location.replaceState(this.location
            .path()
            .split("?")[0], "");
        let result = atob(data.data);
        result = JSON.parse(result);
        this.routedData = result;
      });
    }

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    this.bookname = new FormControl(this.routedData.book_name, [
      Validators.required
    ]);
    this.authorname = new FormControl(this.routedData.author, [
      Validators.required
    ]);
    this.publishername = new FormControl(this.routedData.publisher_name, [
      Validators.required
    ]);
    this.isbn_code = new FormControl(this.routedData.isbn_code, [
      Validators.required
    ]);
    this.no_of_copy = new FormControl(this.routedData.no_copy, [
      Validators.required
    ]);
  }

  createFormGroup() {
    this.bookeditForm = new FormGroup({
      bookname: this.bookname,
      authorname: this.authorname,
      publishername: this.publishername,
      isbn_code: this.isbn_code,
      no_of_copy: this.no_of_copy
    });
  }
  bookUpdate(values) {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    values.id = this.routedData.id;
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}library/updatebook`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Book Updated SuccessFuly"
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
