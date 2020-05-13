import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { DataTableDataSource } from "./ng-m-datatable.datasource";
import { FormGroup, FormBuilder } from "@angular/forms";

export interface TextColumn {
  id: string;
  text: string;
  type?: "text";
}

export interface ActionColumn<T> {
  id: string;
  text: string;
  type: "action";
  actions: [
    {
      text: string;
      handler: (data: T) => void;
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
export class NgMDatatable<T>
  implements AfterViewInit, OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<T>;
  tableHTML: ElementRef;
  @Input() data: Array<T>;
  @Input() columns: Array<TextColumn | ActionColumn<T>>;
  @Input() displayedColumns: String[];
  @Input() title: String;
  @Input() loadingColor?: String;
  dataSource: DataTableDataSource<T>;
  showSpinner = true;

  tableBackground = "white";
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

  ngAfterViewInit() {
    this.dataSource.data = this.data;

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    const tableStyles = window.getComputedStyle(document.getElementById("klk"));
    this.tableBackground = tableStyles.background;
    if (!this.loadingColor) this.loadingColor = tableStyles.color;
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
