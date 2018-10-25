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

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
  tabIndex = 0;
  allCheck: boolean;
  allPermisions: boolean;
  items: any;
  roles;
  result;
  modules;
  logDetails;
  displayedColumns = ["id", "name", "actions"];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  fname: string;
  lname: string;
  username: string;
  address: string;
  password: string;
  roleName: string;
  constructor(public router: Router, public http: Http) {}

  ngOnInit() {
    this.getValue();
    this.roleList();
    setTimeout(() => {
      this.getallModules();
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

  checkAll(event: any) {
    var e = <HTMLInputElement>event.target;
    if (e.checked) {
      this.allCheck = true;
      console.log(this.allCheck);
    } else {
      //this.allCheck = false;
      console.log(this.allCheck);
      this.allPermisions = false;
    }
  }
  changeSelectBox() {
    var e = <HTMLInputElement>event.target;
    if (e.checked) {
      console.log("checked");
      // this.allCheck = true;
    } else {
      console.log("not checked");
      this.allPermisions = false;
    }
  }

  finish() {
    this.router.navigate(["add-user-details"]);
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
        console.log(data);
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
    let data = {
      org_id: 2
    };
    this.http
      .post(`${environment.apiUrl}user/stafflist`, data)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.items = data.data;

        this.dataSource.data = this.items;
      });
  }

  selectStaff(id) {
    this.result = this.items.find(item => item.id === id);

    this.fname = this.result.f_name;
    this.lname = this.result.l_name;
    this.username = this.result.user_name;
    this.password = this.result.hint;
    this.address = this.result.address;
    this.logDetails.user = {
      id: this.result.id,
      name: this.result.name
    };
  }

  getallModules() {
    this.http
      .get(`${environment.apiUrl}user/moduledetails`)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.modules = data.data;
      });
  }
  updateData() {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    if (this.username && this.password) {
      let data = {
        id: this.result.id,
        username: this.username,
        password: this.password
      };
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

  checkModule(event, id){
    
    console.log(event.source._elementRef.nativeElement.textContent);
    
  }
}
export interface Element {
  id: number;
  name: string;
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