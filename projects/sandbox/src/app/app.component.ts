import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import {
  NgMDatatable,
  TextColumn,
  ActionColumn,
  NgMDatatableOptions,
} from "projects/ng-m-datatable/src/public-api";

export interface Modelo {
  balance: any;
  age: any;
  eyeColor: any;
  name: any;
  gender: any;
  company: any;
  email: any;
  phone: any;
  address: any;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Sandbox NgMDataTable";

  ngOnInit() {}
}
