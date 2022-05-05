import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { DataTableDataSource } from "./ng-m-datatable.datasource";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

export enum SearchMode {
  Default,
  Local,
  Backend,
}

export interface NgMDatatableOptions<T> {
  columns: Array<
    | TextColumn
    | BadgeColumn
    | ActionColumn<T>
    | ButtonColumn<T>
    | IconButtonColumn<T>
  >;
  displayedColumns: String[];
  searchMode?: SearchMode;
  title?: String;
  addButton?: {
    icon: string;
    handler: () => void;
  };
  filterSelect?: {
    mode?: SearchMode;
    placeholder: string;
    items: Array<{
      value: string;
      label: string;
    }>;
    filter: (value: T, change: any) => boolean;
    change: (e: any) => void;
  };
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

export interface ButtonColumn<T> {
  id: string;
  text: string;
  type: "button";
  color?: string;
  handler: (data: T) => void;
  disabled?: string;
  icon?: string;
}

export interface IconButtonColumn<T> {
  id: string;
  type: "icon-button";
  text: string;
  icon: string;
  background?:string;
  color?: string;
  handler: (data: T) => void;
  disabled?: string;
}

export interface BadgeColumn {
  id: string;
  text: string;
  color?: string;
  type: "badge";
}

@Component({
  selector: "data-table",
  templateUrl: "./ng-m-datatable.component.html",
  styleUrls: ["./ng-m-datatable.component.css"],
})
export class NgMDatatable<T> implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<T>;
  tableHTML: ElementRef;

  @Output() searchChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();

  @Input() options: NgMDatatableOptions<T>;
  @Input() data: Array<T> = [];

  dataSource: DataTableDataSource<T>;
  showSpinner = true;
  tableColor: SafeStyle;
  tableBg: SafeStyle;
  searchForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.searchForm = fb.group({
      search: [""],
      filterSelect: [""],
    });

    this.searchForm.valueChanges.subscribe((v) => {
      if (
        this.options.searchMode == SearchMode.Default ||
        this.options.searchMode == SearchMode.Local
      ) {
        const filteredData = this.filter(v.search);

        // apply select filter to data source.
        const filteredSelectData = filteredData.filter((x) =>
          this.options.filterSelect.filter(x, v.filterSelect)
        );
        this.dataSource.data =
          filteredSelectData.length > 0 ? filteredSelectData : filteredData;
      } else {
        // Emit event
        this.searchChange.emit(v.search);
        this.filterChange.emit(v.filterSelect);
      }

      this.paginator._changePageSize(this.paginator.pageSize);
    });

    this.searchForm.get("filterSelect").valueChanges.subscribe((v) => {
      if (this.options.filterSelect.mode == SearchMode.Backend) {
        this.filterChange.emit(v);
      }
    });

    this.searchForm.get("search").valueChanges.subscribe((v) => {
      if (this.options.searchMode == SearchMode.Backend) {
        this.searchChange.emit(v);
      }
    });
  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource<T>(this.data || []);
  }

  asAction(c: TextColumn | ActionColumn<T>) {
    return c as ActionColumn<T>;
  }

  filter(searchName: string = ""): any {
    return searchName && searchName.trim()
      ? this.data.filter((x) => {
          for (const key in x) {
            if (
              x[key] &&
              x[key].toString().toLowerCase().includes(searchName.toLowerCase())
            )
              return x;
          }
        })
      : this.data;
  }

  ngAfterViewInit() {
    this.dataSource.data = this.data || [];

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    // buscamos el color (bg & fore ground) que tiene la table proviniente del tema de material y se lo ponemos tambien al container
    // es necesario sanitarlos para que el navegador pueda tomar estos estilos
    this.tableBg = this.sanitizer.bypassSecurityTrustStyle(
      window.getComputedStyle(document.getElementById("klk")).background
    );
    this.tableColor = this.sanitizer.bypassSecurityTrustStyle(
      window.getComputedStyle(document.querySelector(".mat-header-cell")).color
    );

    this.cdRef.detectChanges();

    if (this.data.length > 0) this.toggleLoading(false);
  }

  toggleLoading(v: boolean) {
    this.showSpinner = v;
    const el = document.querySelector("#loading");
    if (el)
      el.setAttribute("style", `border-color : ${this.tableColor} !important;`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      this.dataSource!.data = this.data || [];
      this.toggleLoading(false);
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  }
}
