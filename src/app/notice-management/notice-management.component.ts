import { Component, OnInit, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.prod";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-notice-management',
  templateUrl: './notice-management.component.html',
  styleUrls: ['./notice-management.component.css']
})

export class NoticeManagementComponent implements OnInit {

  sessionValue: any;
  noticeList: any;
  fromDate: any;
  toDate: any;

  constructor(
    public router: Router,
    public http: Http,
    public sessionStore: SessionStorageService,
    public dialog: MatDialog,
  ) { }



  ngOnInit() {
    this.sessionValue = this.sessionStore.retrieve('user-data')[0];
    this.getAllNotice();
    console.log(this.sessionValue );
  }




  openDialog(data): void {
    // console.log(data);

    let dialogRef = this.dialog.open(ModalDialog, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });

  }




  getAllNotice() {
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    let data = {
      user_type_id: this.sessionValue.user_type_id,
      org_id: this.sessionValue.org_code,
      master_id: this.sessionValue.master_id
    }

    // console.log('send data : ...', data);    

    this.http.post(`${environment.apiUrl}notice/noticelist`, data, {headers: header}).map((res)=>res.json())
    .subscribe(data => {
      console.log('All notice list : ', data.data);
      this.noticeList = data.data;
    });
  }




  onClickDeleteNotice(id){

    console.log(id); 
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    let data = {
      id
    }   

    this.http.post(`${environment.apiUrl}notice/deletenotice`, data, {headers: header}).map((res)=>res.json())
    .subscribe(data => {
      console.log(data.data);
      if(data.data){
        this.getAllNotice();
      }
    });    
  }




  onFilterSubmit() {

    // let from = {
    //   year: this.fromDate.getFullYear(),
    //   month: this.fromDate.getMonth()+1,
    //   day: this.fromDate.getDate()
    // };

    // let to = {
    //   year: this.toDate.getFullYear(),
    //   month: this.toDate.getMonth()+1,
    //   day: this.toDate.getDate()
    // }
    // // console.log(this.fromDate.toDateString());    

    // this.noticeList.forEach((ele, index) => {
    //     ele.date = {};
    //     ele.date.year = Number(ele.created_at.substring(0, 4));
    //     ele.date.month = Number(ele.created_at.substring(5, 7));
    //     ele.date.day = Number(ele.created_at.substring(8, 10));        
    // });

    // // console.log(this.noticeList); 
    // console.log(from); 
    // console.log(to);
    
    // let yearFilter = this.noticeList.filter((item)=>{
    //   return item.date.year >= from.year && item.date.year <= to.year;              
    // });
    // let monthFilter = yearFilter.filter((item)=>{
    //   return item.date.month >= from.month && item.date.month <= to.month;              
    // });
    // let dayFilter = monthFilter.filter((item)=>{
    //   return item.date.day >= from.day && item.date.day <= to.day;              
    // });

    // console.log("year filter : ", yearFilter);
    // console.log("month filter : ", monthFilter);
    // console.log("day filter : ", dayFilter);
    
    
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    let data = {
      from: this.fromDate,
      to: this.toDate,
      user_type_id: this.sessionValue.user_type_id,
      org_id: this.sessionValue.org_code,
      master_id: this.sessionValue.master_id
    }
    

    this.http.post(`${environment.apiUrl}notice/filter`, data, {headers: header}).map((res)=>res.json())
    .subscribe(data => {
      console.log('Filter notice list : ', data.data);
      this.noticeList = data.data;
    });
  }




}




@Component({
  selector: 'app-modal-dialog',
  templateUrl: 'modal-dialog.html',
})

export class ModalDialog {

  constructor(
    public dialogRef: MatDialogRef<ModalDialog>,
    public http: Http,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }



  // downloadPdfAttachment(data) { 

  //   console.log(data);
  //   let url = `${environment.apiUrl}public/uploads/Notices/${data}`;

  //   let header = new Headers;
  //   header.append('Access-Control-Allow-Origin', '*');
  //   header.append('Access-Control-Request-Origin', '*');
  //   // header.append('Accept', 'application/jpg');
  //   header.append("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");

  //   return this.http.get(url, {responseType: ResponseContentType.Blob}).map(res => { return { filename: "attachment.jpg", data: res.blob() }})
  //     .subscribe(res => {
  //         // console.log("start download:", res);
  //         var url = window.URL.createObjectURL(res.data);
  //         var a = document.createElement("a");
  //         document.body.appendChild(a);
  //         a.setAttribute("style", "display: none");
  //         a.href = url;
  //         a.download = res.filename;
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //         a.remove(); // remove the element
  //     }, error => {
  //         console.log("download error:", JSON.stringify(error));
  //     }, () => {
  //         console.log("Completed file download.");
  //     });
  //     // }
  // }



}
