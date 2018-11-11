import { Component, OnInit } from "@angular/core";
import * as Chartist from "chartist";
import { Route, ActivatedRoute } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  shiftLists: any;
  orgShiftLists: any;
  examPatList: any;
  orgExamPatList: any;
  checkshift: any;
  checkedBtn: any[];
  daysChecked: boolean;

  constructor(public route: ActivatedRoute, public http: Http) {}
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
  ngOnInit() {
    this.getShiftsNames();
    this.getExamTypeNames();

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
      org_id: 2
    };
    this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          // let jsonResponse = data.json();
          console.log("Org shift list ", data.data);
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
  shiftchange(e) {
    console.log(this.checkedBtn);
    // console.log('check value :', e.checked);
    let header = new Headers();
    header.set("Content-Type", "application/json");

    //if check is ture
    if (e.checked) {
      console.log("add function called");

      let data = {
        org_id: 2,
        shift_id: e.source._elementRef.nativeElement.id
      };

      this.http
        .post(`${environment.apiUrl}shift/addorgshift`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log("After add shift success :", data);
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }

    //if check is false
    if (!e.checked) {
      console.log("delete function called");
      // console.log(eleid);

      let data = {
        id: e.source._elementRef.nativeElement.id
      };

      this.http
        .post(`${environment.apiUrl}shift/orgshiftdelete`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            console.log("After delete shift success :", data);
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }

    // this.getShiftsNames();
  }

  canbeChecked(id) {
    console.log(this.shiftLists[0].id);

    if (this.shiftLists[id].draw === "ttt") {
      // console.log('true');
      return true;
    } else {
      // console.log('false');
      return false;
    }
  }

  //get exam pattern types
  getExamTypeNames() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: 2
    };

    this.http
      .post(`${environment.apiUrl}exampattern/OrgExampatternlist`, data)
      .map(res => res.json())
      .subscribe(data => {
        // let jsonResponse = data.json();
        // console.log("Org exam pattern list ", data.data);
        this.orgExamPatList = data.data;
      });

    this.http
      .get(`${environment.apiUrl}exampattern/exampatternlist`)
      .map(res => res.json())
      .subscribe(data => {
        // console.log("exam pattern lists ", data.data);
        this.examPatList = data.data;
      });
  }

  examTypeChange(e) {
    // console.log('check value :', e.checked);
    let header = new Headers();
    header.set("Content-Type", "application/json");

    //if check is ture
    if (e.checked) {
      // console.log("add function called");

      let data = {
        org_id: 2,
        pat_id: e.source._elementRef.nativeElement.id
      };

      this.http
        .post(`${environment.apiUrl}exampattern/addorgexampatternlist`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log("After add success :", data);
          },
          error => {
            // console.log("Error! ", error);
          }
        );
    }

    //if check is false
    if (!e.checked) {
      // console.log("delete function called");

      let data = { id: e.source._elementRef.nativeElement.id };

      this.http
        .post(`${environment.apiUrl}shift/orgshiftdelete`, data)
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log("After delete success :", data);
          },
          error => {
            // console.log("Error! ", error);
          }
        );
    }
  }
}
