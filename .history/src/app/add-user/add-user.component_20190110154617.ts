import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { environment } from "../../environments/environment.prod";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { log } from 'util';
declare const $: any;
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
  tabIndex = 0;
  allCheckButton: any[] = [];
  allPermisions: boolean = false;
  items: any;
  roles;
  result;
  modules;
  logDetails;
  displayedColumns = ["id", "name", "employee_id", "actions"];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  fname: string;
  lname: string;
  username: string;
  dept_id: number;
  rolecattype: number = 0;
  techingtype: number = 0;
  roleName: string;
  rolecats: any;
  roleSubcats: any;
  depts: any;
  orgShiftLists;
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.getValue();
    this.roleList();
    setTimeout(() => {
      this.getallModules();
      this.getShiftLists();
    }, 600);
    
  }
  ngAfterViewInit() {
    const preBtn = <HTMLElement>document.getElementById("preBtn");
    const moveTab = <HTMLElement>document.querySelector(".move-tab");
    preBtn.style.visibility = "hidden";
    // to ensure moveTab can stay correct position
    $(window).resize(() => {
      const screenWidth = document.body.clientWidth;
      if (screenWidth > 990) {
        moveTab.style.width = "calc((100% - 260px) / 2)";
        if (this.tabIndex === 1) {
          moveTab.style.left = "20vw";
        } else if (this.tabIndex === 2) {
          moveTab.style.left = "42vw";
        }
      } else {
        moveTab.style.width = "34%";
        if (this.tabIndex === 1) {
          moveTab.style.left = "30vw";
        } else if (this.tabIndex === 2) {
          moveTab.style.left = "61.5vw";
        }
      }
    });
    const tabs = document.getElementsByClassName("wizard-tab");
    for (let i = 1; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = "none";
    }
  }

  preOnClick() {
    const moveTab = <HTMLElement>document.querySelector(".move-tab");
    const nextBtn = <HTMLElement>document.getElementById("nextBtn");
    const preBtn = <HTMLElement>document.getElementById("preBtn");
    const tabs = document.getElementsByClassName("wizard-tab");
    const screenWidth = document.body.clientWidth;
    for (let i = 0; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = "none";
    }
    if (this.tabIndex === 2) {
      this.tabIndex--;
      moveTab.style.left = screenWidth > 990 ? "22vw" : "30vw";
      nextBtn.style.visibility = "visible";
      moveTab.innerHTML = "Account";
    } else if (this.tabIndex === 1) {
      this.tabIndex--;
      moveTab.style.left = "-1vw";
      preBtn.style.visibility = "hidden";
      moveTab.innerHTML = "About";
    }
    (<HTMLElement>tabs[this.tabIndex]).style.display = "inherit";
  }

  nextOnClick() {
    const moveTab = <HTMLElement>document.querySelector(".move-tab");
    const nextBtn = <HTMLElement>document.getElementById("nextBtn");
    const preBtn = <HTMLElement>document.getElementById("preBtn");
    const tabs = document.getElementsByClassName("wizard-tab");
    const screenWidth = document.body.clientWidth;
    for (let i = 0; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = "none";
    }
    if (this.tabIndex === 0) {
      this.tabIndex++;
      moveTab.style.left = screenWidth > 990 ? "22vw" : "30vw";
      preBtn.style.visibility = "visible";
      moveTab.innerHTML = "Account";
    } else if (this.tabIndex === 1) {
      this.tabIndex++;
      moveTab.style.left = screenWidth > 990 ? "49vw" : "61.5vw";
      nextBtn.style.visibility = "hidden";
      moveTab.innerHTML = "Address";
    }
    (<HTMLElement>tabs[this.tabIndex]).style.display = "inherit";
  }

  // checkAll(event: any) {
  //   var e = <HTMLInputElement>event.target;
  //   if (e.checked) {
  //     this.allCheck = true;
  //     console.log(this.allCheck);
  //   } else {
  //     //this.allCheck = false;
  //     console.log(this.allCheck);
  //     this.allPermisions = false;
  //   }
  // }
  checkIfAllSelected(event, name, index) {
    // let data = {
    //   name: name.trim(),
    //   value: true
    // }
    if (event.checked) {
      if (name == "all") {
        for (let i = 0; i < this.logDetails.modules.length; i++) {
          this.logDetails.modules[i].permissions.all = true;
          this.logDetails.modules[i].permissions.add = true;
          this.logDetails.modules[i].permissions.edit = true;
          this.logDetails.modules[i].permissions.view = true;
          this.logDetails.modules[i].permissions.delete = true;
          this.allCheckButton[i] = true;
        }
        this.allPermisions = true;
      } else {
        this.logDetails.modules[index].permissions[name] = true;
        if (
          this.logDetails.modules[index].permissions.add == true &&
          this.logDetails.modules[index].permissions.edit == true &&
          this.logDetails.modules[index].permissions.view == true &&
          this.logDetails.modules[index].permissions.delete == true
        ) {
          this.allCheckButton[index] = true;
        }
      }
    } else {
      // this.logDetails.modules[index]["permissions"].splice(
      //   this.logDetails.modules[index]["permissions"].indexOf(this.logDetails.modules[index]["permissions"][name]), 1
      // );
      // console.log();
      if (name == "all") {
        this.allPermisions = false;
        this.logDetails.modules[index].permissions[name] = false;
        this.logDetails.modules[index].permissions.add = false;
        this.logDetails.modules[index].permissions.edit = false;
        this.logDetails.modules[index].permissions.view = false;
        this.logDetails.modules[index].permissions.delete = false;
        this.allCheckButton[index] = false;
      } else {
        this.logDetails.modules[index].permissions[name] = false;
        this.logDetails.modules[index].permissions.all = false;

        this.allCheckButton[index] = false;
      }
    }

    console.log(this.logDetails);
  }

  finish() {
    this.http
      .post(`${environment.apiUrl}role/addpermission`, this.logDetails)
      .map(res => res.json())
      .subscribe(data => {
        if (data.length == this.logDetails.modules.length) {
          console.log(data);
          this.showNotification("top", "right");
          this.router.navigate(["add-user"]);
        }
        //
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  roleList() {
    this.http
      .get(`${environment.apiUrl}role/rolelist`)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.roles = data.data;
      });
  }
  createLog(event) {
    this.logDetails = {
      role: {
        id: this.roleName,
        name: event.source.triggerValue
      }
    };
  }
  getValue() {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");

    let data = { org_id: status[0].org_code };
    this.http
      .post(`${environment.apiUrl}user/stafflist`, data)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.items = data.data;
        this.getroleCats();
        this.dataSource.data = this.items;
      });
  }
  getroleCats() {
    this.http
      .get(`${environment.apiUrl}rolecategory/all`)
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.rolecats = data.data;
        this.getdepts();
      });
  }
  getdepts() {
    this.http
      .get(`${environment.apiUrl}classsection/depts`)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.depts = data.data;
      });
  }
  techingtypechange(event) {
    this.roleSubcats = this.rolecats.filter(
      data => data.parent_id == event.value
    );
  }
  selectStaff(id) {
    this.result = this.items.find(item => item.id === id);
    console.log(this.result);
    this.fname = this.result.f_name;
    this.lname = this.result.l_name;
    this.username = this.result.user_name;
    this.dept_id = this.result.dept_id;
    this.rolecattype = this.result.role_cat_id;

    let rolecats = this.rolecats.find(ele => ele.id == this.rolecattype);
    // console.log(rolecats);
    rolecats.parent_id
      ? (this.techingtype = rolecats.parent_id)
      : (this.techingtype = 0);

    this.techingtype = rolecats.parent_id;
    this.techingtypefilter(this.techingtype);
    // console.log(this.techingtype);
    if (this.logDetails) {
      this.logDetails.user = {
        id: this.result.id,
        name: this.result.name,
        user_type_id: this.result.user_type_id
      };
    } else {
      alert("Please Choose a Possition");
      return false;
    }

    this.logDetails.modules = [];
  }
  techingtypefilter(value) {
    this.roleSubcats = this.rolecats.filter(data => data.parent_id == value);
  }

  getShiftLists() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    var status = this.SessionStore.retrieve("user-data");

    let data = { org_id: status[0].org_code };

    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        this.orgShiftLists = data.data;
      });
  }

  getallModules() {
    this.http
      .get(`${environment.apiUrl}user/moduledetails`)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.modules = data.data;
      });
  }
  updateData() {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve("user-data");
    if (this.username) {
      let data = {
        org_id: status[0].org_code,
        id: this.result.id,
        username: this.username,
        dept_id: this.dept_id,
        rolecattype: this.rolecattype,
        fname: this.fname,
        lname: this.lname
      };
      console.log(data);

      this.http
        .post(`${environment.apiUrl}user/updatestaff`, data)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
        });
    } else {
      alert("Username and Password Require");
    }
  }

  checkModule(event, id) {
    if (event.checked) {
      let data = {
        id: id,
        name: event.source._elementRef.nativeElement.textContent.trim(),
        permissions: {}
      };
      this.logDetails["modules"].push(data);
    } else {
      let module = this.logDetails.modules.find(x => x.id == id);
      this.logDetails.modules.splice(
        this.logDetails.modules.indexOf(module),
        1
      );
    }
    // console.log(this.logDetails);
    // console.log(event.source._elementRef.nativeElement.textContent);
  }

  //Botification model.
  showNotification(from, align) {
    const type = ["", "info", "success", "warning", "danger"];

    const color = Math.floor(Math.random() * 4 + 1);

    $.notify(
      {
        icon: "notifications",
        message: "User Role Successfuly Created"
      },
      {
        type: "success",
        timer: 2000,
        placement: {
          from: from,
          align: align
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>"
      }
    );
  }
}
export interface Element {
  id: number;
  name: string;
  employee_id: string;
}

// const ELEMENT_DATA: Element[] = [
//   { id: 1, name: 'Hydrogen',  },
//   { id: 2, name: 'Hydrogen', },
//   { id: 3, name: 'Hydrogen', },
//   { id: 4, name: 'Hydrogen',  },
//   { id: 5, name: 'Hydrogen', },
//   { id: 6, name: 'Hydrogen', },
//   { id: 7, name: 'Hydrogen', },
// ];

// export class UserDataSource extends DataSource<any> {
//   constructor() {
//     super();
//   }
//   connect(): Observable<> {
    
//   }
//   disconnect() { }
// }