import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent implements OnInit {
  @Input("show") showloader: boolean;
  constructor() {}

  ngOnInit() {}
}
