import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Router } from '@angular/router';


@Component({
  selector: "app-class-list",
  templateUrl: "./class-list.component.html",
  styleUrls: ["./class-list.component.scss"]
})
export class ClassListComponent implements OnInit {

  classList: any;
  sectionList: any;
  classId: any;
  sectionId: any;
  fieldCountArr: any;
  typeId: any;
  org_code: any;
  choosenClassAndSectionArr: any;
  finalClassSeclistArr: any;
  shiftID: any;
  orgShiftLists: any;
  semList: any = [];
  yearList: any = [];
  semester: any;
  year: any;
  shift: any;
  orgClassSectionList: any;
  sortArray: any = [];
  showSameasPreviousButton: boolean;
  

  // @ViewChild('shiftOption') private shifts: ElementRef;

  constructor(public http: Http, public router: Router, public sessionStore: SessionStorageService) {}

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.getOrgDetails();
    this.getShiftLists();
    this.getSemList();
    this.generateYearList(10);
    this.getClassSection();
    this.fieldCountArr = [1];
    this.choosenClassAndSectionArr = [];
    this.finalClassSeclistArr = [];
  }

  getOrgDetails(){
    //org_code from session
    // this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
  
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {org_id: this.org_code};

    this.http
      .post(`${environment.apiUrl}org/getdetail`, data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        // console.log("org details", data);
        this.typeId = data.data[0].org_type_id;
        // console.log("type id :", this.typeId);
        this.getClasslistNames(this.typeId);
    });
  }






// ########################################################################
//       ------------------ getting all shifts here -----------------
// ########################################################################
getShiftLists() {
  let header = new Headers();
  header.set("Content-Type", "application/json");

  let data = {
    org_id: this.org_code,
  };
  
  this.http
    .post(`${environment.apiUrl}shift/orgshiftlist`, data)
    .map(res => res.json())
    .subscribe(
      data => {
        this.orgShiftLists = data.data;       
  });
}





// ########################################################################
// ------------------ After choose shift -----------------
// ########################################################################
async onChooseShift(e) {
  // this.shiftID = await e.value;       

  // let ifAllSelect = await this.shiftID.filter((ele) => {
  //   return ele == "all";
  // });
  
  // if(ifAllSelect.length > 0){

    // this.shiftID = [];
    // let options = <HTMLSelectElement>document.getElementsByClassName('shiftOptions');
    // Array.from(options).forEach(ele => {
    //   if(ele.children[1].innerHTML.toLocaleLowerCase().trim().toString() != "all"){
    //     ele.children[0].classList.value = "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted mat-pseudo-checkbox-checked"; 
    //     this.shiftID.push(ele.getAttribute('ng-reflect-value'));      
    //   }else{
    //   }      
    // });
    
  // }else if(ifAllSelect.length < 1){
    this.shiftID = [];

    let options = <HTMLSelectElement>document.getElementsByClassName('shiftOptions');

    Array.from(options).forEach(ele => {
        if(ele.children[0].classList.value == "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted mat-pseudo-checkbox-checked"){
          if(ele.children[1].innerHTML.toLocaleLowerCase().trim().toString() != "all"){
            ele.children[0].classList.value = "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted";
            this.shiftID.push(ele.getAttribute('ng-reflect-value'));
          }          
        }      
    });

  // }else{
    // this.shiftID = e.value;     
  // }
}





// ########################################################################
//       ------------------ getting classlist here -----------------
// ########################################################################
  getClasslistNames(oti) {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_type_id: oti
    };

    this.http
      .post(`${environment.apiUrl}classlist/classlist`, data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        this.classList = data.data;
    });


    this.http
      .post(`${environment.apiUrl}classlist/sectionlist`,data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        this.sectionList = data.data;
    });
  }




// ########################################################################
//       ------------------ getting classlist here -----------------
// ########################################################################
getSemList() {
  let header = new Headers();
  header.set("Content-Type", "application/json");

  let data = {
    org_id: this.sessionStore.retrieve('user-data')[0].org_code,
  };

  this.http
    .post(`${environment.apiUrl}classsection/getallsem`, data, {headers: header})
    .map(res => res.json())
    .subscribe(data => {
      console.log("sem list ", data.data);
      if(data.data){
        this.semList = data.data;
        console.log("sem list ", this.semList);
      }      
  });
}



// ########################################################################
//       ------------------ After choosing a class -----------------
// ########################################################################
  onChangeClass(e, f) {
    // console.log('class ', e.value); 
    this.classId = e.value;  
    
    let check_exist = this.finalClassSeclistArr.filter((ele)=> {
      return ele.row == f;
    });

    if(check_exist.length > 0){
      let i = this.finalClassSeclistArr.indexOf(check_exist[0]);
      this.finalClassSeclistArr.splice(i,1);
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      // console.log('final array ', this.finalClassSeclistArr);
    }else{
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      // console.log('final array ', this.finalClassSeclistArr);
    }
  }




// ########################################################################
//    ------------------ After change section function -----------------
// ########################################################################
  onChangeSection(e, f) {
    // console.log('section ', e.value);
    // console.log('row num ', f);

    // console.log('final array at first ', this.finalClassSeclistArr);
    this.sectionId = e.value; 

    let check_exist = this.finalClassSeclistArr.filter((ele)=> {
      return ele.row == f;
    });

    // console.log('checking obj ', check_exist);      

    if(check_exist.length > 0){
      let i = this.finalClassSeclistArr.indexOf(check_exist[0]);
      this.finalClassSeclistArr.splice(i,1);
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );
    }else{
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );
    }
  }



  increaseField(){
    // console.log(this.fieldCountArr.length);
    let lengthIncValue = this.fieldCountArr.length;
    this.fieldCountArr.push(lengthIncValue++);
    // console.log(this.fieldCountArr);        
  }



  onClickSave() {

    let sentData = {      
        details : this.finalClassSeclistArr,      
        year: this.year, 
        sem: this.semester,
        shift: this.shift,
        org_id: this.sessionStore.retrieve('user-data')[0].org_code,
    };    

    let header = new Headers();
    header.set("Content-Type", "application/json");    

    this.http
      .post(`${environment.apiUrl}classsection/add`, sentData, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        console.log("after success add class/section : ", data);
        this.router.navigate(['/dashboard']);
    }); 
  }



  generateYearList(yearRange) {
    let currentYear = new Date().getFullYear();
    this.yearList.push(currentYear);
    for (let index = 0; index < yearRange; index++) {
      currentYear++;
      this.yearList.push(currentYear);      
    }   
  }




  sameAsPrevious() {

    let header = new Headers();
    header.set("Content-Type", "application/json");

    let sentData = {            
      year: this.year, 
      sem: this.semester,
      shift_id: this.shift,
      org_id: this.sessionStore.retrieve('user-data')[0].org_code,
    };

    this.http
    .post(`${environment.apiUrl}classsection/sameasprevious`, sentData, {headers: header})
    .map(res => res.json())
    .subscribe(
      data => {
        console.log(data);        
    });

  }




  showSameAsPreviousBtn() {

    console.log('show btn called...'); 
    var year = this.year - 1;   

    if(year && this.shift && this.semester) {

      let filterData = this.orgClassSectionList.filter( item => {
        return item.year == year && item.sem_id == this.semester;
      });

      console.log('filter data : ', filterData);
      
      if(filterData.length > 0) {
        this.showSameasPreviousButton = true;
      }else{
        this.showSameasPreviousButton = false;
      } 
    }
  }




  getClassSection() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}classsection/getall`, data, {headers: header})
      .map(res => res.json())
      .subscribe(
        data => {
          console.log("Org class/stream list ", data.data);
          this.orgClassSectionList = data.data;
    });
  }





  createSortArray(arr){

    arr.forEach(ele => {

      var obj = {
        class_id: ele.class_id,
        sec_id: ele.sec_id,
        class_name: ele.class.class_name,
        sections: [
          {
            section_name: ele.section.sec_name,
            classSectionIndexId: ele.id
          }
        ],
        rs: 1
      }

      let check_exist = this.sortArray.filter((element)=> {
        return element.class_id == ele.class_id;
      });

      if(check_exist.length > 0){
        let i = this.sortArray.indexOf(check_exist[0]);
        this.sortArray.splice(i,1); 
        check_exist[0].rs += check_exist[0].rs;

        check_exist[0].sections.push({
          section_name: ele.section.sec_name,
          classSectionIndexId: ele.id
        });

        this.sortArray.push(check_exist[0]);       
      }else{
        this.sortArray.push(obj);
      }
    });    
  }

  
}
