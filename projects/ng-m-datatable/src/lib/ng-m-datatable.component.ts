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
  Default = undefined,
  Local = 1,
  Backend = 2,
}

export enum PaginationMode {
  Default,
  Local,
  Backend,
}

interface PageChangeEventPayload {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number
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
  pagination?: {
    mode?: PaginationMode;
    pageIndex?: number;
    pageSize?: number;
    change?: (e: PageChangeEventPayload) => void;
  }
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
  background?: string;
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

  // Extra Paginator Options
  @Input() dataLength: number = 0;

  dataSource: DataTableDataSource<T>;
  showSpinner = true;
  tableColor: SafeStyle;
  tableBg: SafeStyle;
  searchForm: FormGroup;

  currentPageIndex: number;
  currentPageSize: number;

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

      // reset the page index, when the search or filter select changes
      this.paginator.pageIndex = 0;

      if (
        this.options.searchMode == SearchMode.Default ||
        this.options.searchMode == SearchMode.Local
      ) {
        const filteredData = this.filter(v.search);

        if (this.options.filterSelect) {
          // apply select filter to data source.
          const filteredSelectData = filteredData.filter((x) =>
            this.options.filterSelect.filter(x, v.filterSelect)
          );
          this.dataSource.data =
            filteredSelectData.length > 0 ? filteredSelectData : filteredData;
        }
        else {
          this.dataSource.data = filteredData;
        }

      }

      this.cdRef.detectChanges();
      this.paginator._changePageSize(this.paginator.pageSize);
    });

    this.searchForm.get("search").valueChanges.subscribe((v) => {
      if (this.options.searchMode == SearchMode.Backend) {
        this.searchChange.emit(v);
      }
    });
  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource<T>(this.data || []);

    // if not set, set default
    if (!this.options.pagination)
      this.options.pagination = {
        mode: PaginationMode.Default,
        pageIndex: 0,
        pageSize: 50,
      };

    if (!this.options.searchMode) {
      this.options.searchMode = SearchMode.Default;
    }

    // determine the size of the data.
    if (this.options.pagination?.mode !== PaginationMode.Backend) {
      this.dataLength = this.dataSource.data.length;
    }

    if (this.options.filterSelect) {
      this.searchForm.get("filterSelect").valueChanges.subscribe((v) => {
        if (this.options.filterSelect.mode == SearchMode.Backend) {
          this.filterChange.emit(v);
        }
      });
    }
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

  onPageChange(e: PageChangeEventPayload) {

    if (e.pageIndex == this.currentPageIndex && e.pageSize == this.currentPageSize) {
      return
    }
    else if (this.options.pagination.change)
      this.options.pagination.change(e)

    this.currentPageIndex = e.pageIndex
    this.currentPageSize = e.pageSize
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
      if (this.options.pagination.mode == PaginationMode.Backend) {
        const data = this.data;

        // fill next page data so the nexpage button is enabled. Only do it if we have enough data to fill the page.
        if (this.data.length >= this.paginator.pageSize) {
          data.push(...Array.from(Array(1 * this.paginator.pageSize).keys()).map(x => ({} as any)));
        }

        // fill data source with dummy empty data to force the table to render previous pages.
        data.unshift(...Array.from(Array(this.paginator.pageIndex * this.paginator.pageSize).keys()).map(x => ({} as any)));
        this.dataSource.data = data;
      }
      else this.dataSource.data = this.data || [];
      this.toggleLoading(false);


      this.paginator._changePageSize(this.paginator.pageSize);

      // Change paginator length;
      if (this.options.pagination.mode !== PaginationMode.Backend) {
        this.dataLength = this.dataSource.data.length;
      }
    }
  }
}
