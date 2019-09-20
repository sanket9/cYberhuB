import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import * as csv from "csvtojson";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: "app-schedule-exam",
  templateUrl: "./schedule-exam.component.html",
  styleUrls: ["./schedule-exam.component.scss"],
  providers: [DatePipe]
})
export class ScheduleExamComponent implements OnInit {
  myControl = new FormControl();
  // options: any = [
  //   {id: '1111', value: 'One'}, 
  //   {id: '2222', value: 'Two'}, 
  //   {id: '3333', value: 'Three'}];
  options: any = [];
  filteredOptions: Observable<string[]>;
  selected_org_id: string;
  selected_org_reg: string;
  
  fileReaded: any;
  examForm: FormGroup;
  org_id: string;
  master_id;
  showloader: boolean = false;
  sem_list: any;

  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.showloader = true;
    this.http.get(`${environment.apiUrl}org/alllist`).map(resp => resp.json()).subscribe((data: any) => {
      //console.log('Org list data...........', data.data);
      if(data.data) {
        this.options = data.data;

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );

        this.showloader = false;
      }
      //console.log('Org list data in options...........', this.options);
    });

    this.createFormGroup();
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.master_id = status[0].master_id;

    this.getExamName();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.org_name.toLowerCase().indexOf(filterValue) === 0);
  }

  getOrgDetails(org_id, org_reg) {
    console.log('Org Details......', org_id, org_reg);
    this.selected_org_id = org_id;
    this.selected_org_reg = org_reg;

    this.examForm.patchValue({    
      "org_code": org_reg
    }); 
  }

  saveOrgCode() {
    let header = new Headers();
    header.append("Content-Type", "application/json");

    if(this.selected_org_id!=null && this.examForm.value.org_code!=null && this.examForm.value.org_code!="") {
      // let fd = new FormData();
      // fd.append("org_id", this.selected_org_id);
      // fd.append("org_reg", this.examForm.value.org_code);
      //console.log('this.examForm.value.org_code............', this.examForm.value.org_code);
      // this.selected_org_reg = this.examForm.value.org_code;

      //       this.notification.showNotification(
      //         "top",
      //         "right",
      //         "success",
      //         "Code saved successfully."
      //       );
      let senddata = {
        "org_id": this.selected_org_id,
        "org_reg": this.examForm.value.org_code
      };

      this.http
        .post(`${environment.apiUrl}org/edit-code`, senddata)
        .map(res => res.json())
        .subscribe(data => {
          // console.log(data);
          if (data.status == 1) {
            this.selected_org_reg = this.examForm.value.org_code;

            this.notification.showNotification(
              "top",
              "right",
              "success",
              "Code saved successfully."
            );
          }
        });
    } else {
      this.notification.showNotification(
        "top",
        "right",
        "warning",
        "Select an organization and enter organization code."
      );
    }
  }

  getExamName() {
    // this.http.get(`${environment.apiUrl}exam/getexamname`).map(resp => resp.json()).subscribe((data: any) => {
    //   console.log('data....', data);
    //   if(data.data) {
    //     this.sem_list = data.data;
    //   }
    // });
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    let data = { org_id: status[0].org_code };

    this.http
      .post(`${environment.apiUrl}classsection/getallsem`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        //console.log('data sem...............', data);
        this.sem_list = data.data;
      });
  }

  handleFileSelect(fileInput: any) {
    this.fileReaded = fileInput.target.files[0];
    // console.log(this.fileReaded);
    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    if (this.fileReaded.type === "application/vnd.ms-excel") {
      reader.onload = e => {
        // let csv: string = reader.result;
        // let allTextLines = csv.split(/\r|\n|\r/);
        // let headers = allTextLines[0].split(",");
        // let lines = [];

        // for (let i = 0; i < allTextLines.length; i++) {
        //   // split content based on comma
        //   let data = allTextLines[i].split(",");
        //   if (data.length === headers.length) {
        //     let tarr = [];
        //     for (let j = 0; j < headers.length; j++) {
        //       tarr.push(data[j]);
        //     }

        //     // log each row to see output
        //     lines.push(tarr);
        //   }
        // }
        // // all rows in the csv file
        // console.log(">>>>>>>>>>>>>>>>>", lines);
        this.examForm.patchValue({ exam_file: this.fileReaded });
      };
    } else {
      alert("File not accepted. Please select .csv File...");
    }
  }

  createFormGroup() {
    this.examForm = new FormGroup({
      exam_name: new FormControl("", [Validators.required]),
      exam_date: new FormControl("", [Validators.required]),
      org_code: new FormControl("", [Validators.required]),
      exam_file: new FormControl(null, [Validators.required]),
    });
  }

  FormSubmit(values) {
    let header = new Headers();
    header.append("Content-Type", "multipart/form-data");
    values.org_id = this.org_id;

    if(this.examForm.value.exam_date)
      this.examForm.value.exam_date = this.datePipe.transform(this.examForm.value.exam_date, 'dd/MM/yyyy');

    let fd = new FormData();
    fd.append("exam_name", "Sem " + this.examForm.value.exam_name);
    fd.append("exam_date", this.examForm.value.exam_date);
    fd.append("exam_file", this.fileReaded);
    fd.append("org_id", this.org_id);
    fd.append("master_id", this.master_id);
    fd.append("exam_centre_org_id", this.selected_org_id);
    fd.append("org_reg", this.selected_org_reg);
    // console.log('full submit - exam_name............', "Sem " + this.examForm.value.exam_name);
    // console.log('full submit - exam_date............', this.examForm.value.exam_date);
    // console.log('full submit - exam_centre_org_id............', this.selected_org_id);
    // console.log('full submit - org_reg............', this.selected_org_reg);

    this.http
      .post(`${environment.apiUrl}exam/create`, fd)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.data) {
          
          this.router.navigateByUrl("exam/room-select");
        }
      });
  }

  downloadDemo(url){
    return this.http
      .get(url, {
        responseType: ResponseContentType.Blob
        //search: // query string if have
      })
      .map(res => {
        return { filename: "demo-exam.csv", data: res.blob() };
      })
      .subscribe(
        res => {
          // console.log("start download:", res);
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        error => {
          console.log("download error:", JSON.stringify(error));
        },
        () => {
          console.log("Completed file download.");
        }
      );
  }
  
  submitBtnDisabled() {
    if(this.examForm.valid) {
      return false;
    } else {
      return true;
    }
  }
}
