import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { DataTableDataSource } from "./ng-m-datatable.datasource";
import { FormGroup, FormBuilder } from "@angular/forms";

export interface NgMDatatableOptions<T> {
  columns: Array<TextColumn | ActionColumn<T>>;
  displayedColumns: String[];
  title?: String;
  addButton?: {
    icon: string;
    handler: () => void;
  };
  loadingColor?: String;
}

export interface TextColumn {
  id: string;
  text: string;
  type?: "text";
}

export interface ActionColumn<T> {
  id: string;
  text: string;
  type: "action";
  actions: Array<{
    text: string;
    handler: (data: T) => void;
    icon: string;
    disabled?: string;
  }>;
}

@Component({
  selector: "data-table",
  templateUrl: "./ng-m-datatable.component.html",
  styleUrls: ["./ng-m-datatable.component.css"],
})
export class NgMDatatable<T> implements OnInit, OnChanges, AfterViewChecked {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<T>;
  tableHTML: ElementRef;

  @Input() options: NgMDatatableOptions<T>;
  @Input() data: Array<T> = [];

  dataSource: DataTableDataSource<T>;
  showSpinner = true;
  tableColor: string;
  tableBg: string;
  searchForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.searchForm = fb.group({
      search: [""],
    });

    this.searchForm.valueChanges.subscribe((v) => {
      this.dataSource.data = this.filter(v.search);
      this.paginator._changePageSize(this.paginator.pageSize);
    });
  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource<T>(this.data || []);
  }

  asAction(c: TextColumn | ActionColumn<T>) {
    return c as ActionColumn<T>;
  }

  filter(searchName: string): any {
    return searchName && searchName.trim()
      ? this.data.filter((x) => {
          for (const key in x) {
            if (
              x[key].toString().toLowerCase().includes(searchName.toLowerCase())
            )
              return x;
          }
        })
      : this.data;
  }

  ngAfterViewChecked() {
    this.dataSource.data = this.data || [];

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.tableBg = window.getComputedStyle(
      document.getElementById("klk")
    ).background;
    this.tableColor = window.getComputedStyle(
      document.querySelector(".mat-header-cell")
    ).color;
    document
      .querySelector(".table-container")
      .setAttribute(
        "style",
        `background : ${this.tableBg}; color : ${this.tableColor}`
      );

    if (!this.options!.loadingColor)
      this.options!.loadingColor = this.tableColor;

    if (this.data.length > 0) this.showSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes", changes);
    if (changes.data) {
      this.dataSource.data = this.data;
      this.showSpinner = false;
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  }
}
