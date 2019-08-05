import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { NotificationService } from '../services/notification.service'
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { environment } from "../../environments/environment.prod";

@Component({
  selector: 'app-gallery-upload',
  templateUrl: './gallery-upload.component.html',
  styleUrls: ['./gallery-upload.component.scss']
})
export class GalleryUploadComponent implements OnInit {
  filename: string;
  file;
  org_id: string;
  title: string;
  allImages: any;

  constructor(
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService,
  ) { }

  ngOnInit() {
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.getAllImages();
  }

  selectImage(event) {
    let elem = event.target;
    if (elem.files.length > 0) {
      this.filename = elem.files[0].name;
      this.file = elem.files[0];
    }
  }

  getAllImages() {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let apidata = {
      org_id: this.org_id
    }

    this.http
      .post(`${environment.apiUrl}gallery/getallimage`, apidata).map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data.data) {
          this.allImages = data.data
        }
      })
  }
  uploadDetails() {

    let formData = new FormData();
    formData.append("file", this.file);
    formData.append("title", this.title);
    formData.append("org_id", this.org_id);
    this.http
      .post(`${environment.apiUrl}gallery/add`, formData).map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.data) {
          this.getAllImages();
          this.title = "";
          this.file = ""
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Image Updated SuccessFuly"
          );
        }
      })
  }

  deleteImage(id) {
    if (confirm("Do you want to delete it ? ")) {
      
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({ headers: headers });
      let apidata = {
        id
      }
  
      this.http
        .post(`${environment.apiUrl}gallery/delete`, apidata).map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (data) {
            this.getAllImages();
            this.notification.showNotification(
              "top",
              "right",
              "success",
              "Image Deleted SuccessFuly"
            );
          }
        })
    }
  }
}
