import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { DataTableDataSource } from "./ng-m-datatable.datasource";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Action } from "rxjs/internal/scheduler/Action";

export interface TextColumn {
  id: string;
  text: string;
  type?: "text";
}
export interface ActionColumn {
  id: string;
  text: string;
  type: "action";
  actions: [
    {
      text: string;
      handler: () => void;
      icon: string;
      disabled?: string;
    }
  ];
}

@Component({
  selector: "data-table",
  templateUrl: "./ng-m-datatable.component.html",
  styleUrls: ["./ng-m-datatable.component.css"],
})
export class NgMDatatable<T> implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<T>;
  @Input() data: Array<T>;
  @Input() columns: Array<TextColumn | ActionColumn>;
  @Input() displayedColumns: String[];
  @Input() tittle: String;
  @Input() loadingColor?: String;
  dataSource: DataTableDataSource<T>;
  showSpinner = true;

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
    console.log(this.data, this.columns, this.displayedColumns);
    this.dataSource = new DataTableDataSource<T>(this.data);
  }

  asAction(c: TextColumn | ActionColumn) {
    return c as ActionColumn;
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

  ngAfterViewInit() {
    this.dataSource.data = this.data;

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      this.dataSource.data = this.data;
      this.showSpinner = false;
      this.paginator._changePageSize(this.paginator.pageSize);
      // this.table.renderRows();
      // this.dataSource.connect();
    }
  }
}
