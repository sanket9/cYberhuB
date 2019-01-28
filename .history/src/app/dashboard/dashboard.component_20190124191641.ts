import { Component, OnInit, Inject } from "@angular/core";
import * as Chartist from "chartist";
import { Route, ActivatedRoute } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  showloader: boolean = false;
  shiftLists: any;
  orgShiftLists: any;
  examPatList: any;
  orgExamPatList: any;
  checkshift: any;
  checkedBtn: any[];
  daysChecked: boolean;
  org_code: any;
  orgClassSectionList: any;
  sortArray: any;
  courseCats: any;
  showBox: boolean = false;
  editshowBox: boolean = false;
  cc_name;
  cc_parent;
  cc_short_name;
  cc_name_edit;
  cc_parent_edit;
  cc_short_name_edit;
  constructor(
    public route: ActivatedRoute,
    public http: Http,
    public sessionStore: SessionStorageService
  ) {}
  startAnimationForLineChart(chart) {
    // let seq: any, delays: any, durations: any;
    // seq = 0;
    // delays = 80;
    // durations = 500;
    // chart.on('draw', function(data) {
    //   if(data.type === 'line' || data.type === 'area') {
    //     data.element.animate({
    //       d: {
    //         begin: 600,
    //         dur: 700,
    //         from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
    //         to: data.path.clone().stringify(),
    //         easing: Chartist.Svg.Easing.easeOutQuint
    //       }
    //     });
    //   } else if(data.type === 'point') {
    //         seq++;
    //         data.element.animate({
    //           opacity: {
    //             begin: seq * delays,
    //             dur: durations,
    //             from: 0,
    //             to: 1,
    //             easing: 'ease'
    //           }
    //         });
    //     }
    // });
    // seq = 0;
  }
  startAnimationForBarChart(chart) {
    // let seq2: any, delays2: any, durations2: any;
    // seq2 = 0;
    // delays2 = 80;
    // durations2 = 500;
    // chart.on('draw', function(data) {
    //   if(data.type === 'bar'){
    //       seq2++;
    //       data.element.animate({
    //         opacity: {
    //           begin: seq2 * delays2,
    //           dur: durations2,
    //           from: 0,
    //           to: 1,
    //           easing: 'ease'
    //         }
    //       });
    //   }
    // });
    // seq2 = 0;
  }
  openaddBox() {
    if (!this.showBox) {
      this.showBox = true;
    } else {
      this.showBox = false;
    }
  }

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve("user-data")[0].org_code;

    this.getShiftsNames();
    this.getExamTypeNames();
    this.getClassSection();
    this.getAllCoursecat();
    this.sortArray = [];

    // console.log('org_id : ', this.org_code);

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      series: [[12, 17, 7, 17, 23, 18, 38]]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    // var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    // this.startAnimationForLineChart(dailySalesChart);

    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ["12p", "3p", "6p", "9p", "12p", "3a", "6a", "9a"],
      series: [[230, 750, 450, 300, 280, 240, 200, 190]]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    // this.startAnimationForLineChart(completedTasksChart);

    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ];
    // var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    //this.startAnimationForBarChart(websiteViewsChart);
  }

  getShiftsNames() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          // let jsonResponse = data.json();
          // console.log("Org shift list ", data.data);
          this.orgShiftLists = data.data;
        }
        // error => {
        //   console.log("Error! ", error);
        // }
      );

    this.http
      .get(`${environment.apiUrl}shift/shiftlist`)
      .map(res => res.json())
      .subscribe(data => {
        // console.log("Shift lists ", data.data);
        this.shiftLists = data.data;
      });
  }

  // shift change function
  shiftchange(e, id) {
    // console.log(this.checkedBtn);
    // console.log('check value :', e.checked);
    let header = new Headers();
    header.set("Content-Type", "application/json");

    //if check is ture
    if (e.checked) {
      // console.log("add function called");

      let data = {
        org_id: this.org_code,
        shift_id: e.source._elementRef.nativeElement.id
      };

      this.http
        .post(`${environment.apiUrl}shift/addorgshift`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log("After add shift success :", data);
            this.getShiftsNames();
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }

    //if check is false
    if (!e.checked) {
      // console.log("delete function called");
      // console.log(eleid);

      let data = {
        id
      };

      this.http
        .post(`${environment.apiUrl}shift/orgshiftdelete`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log("After delete shift success :", data);
            this.getShiftsNames();
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }

    // this.getShiftsNames();
  }

  // canbeChecked(id) {
  //   console.log(this.shiftLists[0].id);

  //   if (this.shiftLists[id].draw === "ttt") {
  //     // console.log('true');
  //     return true;
  //   } else {
  //     // console.log('false');
  //     return false;
  //   }
  // }

  //get exam pattern types
  getExamTypeNames() {
    this.showloader = true;
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}exampattern/OrgExampatternlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        // let jsonResponse = data.json();
        // console.log("Org exam pattern list ", data.data);
        this.orgExamPatList = data.data;
      });

    // this.http
    //   .get(`${environment.apiUrl}exampattern/exampatternlist`)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     console.log("exam pattern lists ", data.data);
    //     this.examPatList = data.data;
    //   });
  }

  examTypeChange(e, id) {
    // console.log('check value :', e.checked);
    let header = new Headers();
    header.set("Content-Type", "application/json");

    //if check is ture
    if (e.checked) {
      // console.log("add exam function called");

      let data = {
        org_id: this.org_code,
        pat_id: e.source._elementRef.nativeElement.id
      };

      this.http
        .post(`${environment.apiUrl}exampattern/addorgexampatternlist`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log("After exam add success :", data);
            this.getExamTypeNames();
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }

    //if check is false
    if (!e.checked) {
      // console.log("delete exam function called");

      let data = { id };

      this.http
        .post(`${environment.apiUrl}exampattern/delete`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log("After exam delete success :", data);
            this.getExamTypeNames();
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }
  }

  getClassSection() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}classsection/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        console.log("Org class/stream list ", data.data);
        this.orgClassSectionList = data.data;
        this.createSortArray(this.orgClassSectionList);
      });
  }

  createSortArray(arr) {
    // var rs = 1;
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
      };

      let check_exist = this.sortArray.filter(element => {
        return element.class_id == ele.class_id;
      });

      if (check_exist.length > 0) {
        console.log("exist");
        let i = this.sortArray.indexOf(check_exist[0]);
        this.sortArray.splice(i, 1);
        check_exist[0].rs += check_exist[0].rs;

        check_exist[0].sections.push({
          section_name: ele.section.sec_name,
          classSectionIndexId: ele.id
        });

        this.sortArray.push(check_exist[0]);
      } else {
        this.sortArray.push(obj);
      }
    });
    //console.log(this.sortArray);
  }

  // classOrSectionChange(e, id){

  //   let header = new Headers();
  //   header.set("Content-Type", "application/json");

  //   //if check is false
  //   if (!e.checked) {
  //     // console.log("delete exam function called");
  //     let data = { id };

  //     this.http
  //       .post(`${environment.apiUrl}classSection/delete`, data)
  //       .map(res => res.json())
  //       .subscribe(
  //         data => {
  //           console.log("After Class/Stream delete success :", data);
  //           this.getClassSection();
  //         },
  //         error => {
  //           console.log("Error! ", error);
  //         }
  //       );
  //   }
  // }

  onDeleteSection(id) {
    console.log(id);
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = { id };

    this.http
      .post(`${environment.apiUrl}classsection/delete`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          //console.log("After Class/Stream delete success :", data);
          this.getClassSection();
        },
        error => {
          console.log("Error! ", error);
        }
      );
  }

  getAllCoursecat() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code
    };

    this.http
      .post(`${environment.apiUrl}coursecat/getall`, data)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data.data) {
          this.showloader = false;
          this.courseCats = data.data;
        }
      });
  }

  editboxShow(id) {
    this.showBox = false;
    this.editshowBox = true;
    let selected = this.courseCats.filter(data => data.id == id);
    this.cc_name_edit = selected[0].name;
    this.cc_short_name_edit = selected[0].short_name;
    this.cc_parent_edit = selected[0].parent_id;
  }
  addCategory() {
    if (
      this.cc_name != "" &&
      this.cc_name != undefined &&
      (this.cc_parent != "" && this.cc_parent != undefined) &&
      (this.cc_short_name != "" && this.cc_short_name != undefined)
    ) {
      this.showloader = true;
      let header = new Headers();
      header.set("Content-Type", "application/json");

      let data = {
        name: this.cc_name,
        org_id: this.org_code,
        parent_id: this.cc_parent,
        short_name: this.cc_short_name
      };

      this.http
        .post(`${environment.apiUrl}coursecat/addNew`, data)
        .map(res => res.json())
        .subscribe(data => {
          //console.log(data);
          if (data.data) {
            this.getAllCoursecat();
            this.showloader = false;
          }
        });
    }
  }
  editCategory(id){
    if (
      this.cc_name_edit != "" &&
      this.cc_name_edit != undefined &&
      (this.cc_parent_edit != "" && this.cc_parent_edit != undefined) &&
      (this.cc_short_name_edit != "" && this.cc_short_name_edit != undefined)
    ) {
      this.showloader = true;
      let header = new Headers();
      header.set("Content-Type", "application/json");

      let data = {
        id,
        name: this.cc_name_edit,
        org_id: this.org_code,
        parent_id: this.cc_parent_edit,
        short_name: this.cc_short_name_edit
      };

      this.http
        .post(`${environment.apiUrl}coursecat/edit`, data)
        .map(res => res.json())
        .subscribe(data => {
          //console.log(data);
          if (data.data) {
            this.getAllCoursecat();
            this.showloader = false;
          }
        });
    }
  }

  // classsection/getallsem
}

