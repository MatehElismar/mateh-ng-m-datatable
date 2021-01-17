import { NgModule } from "@angular/core";
import { NgMDatatable } from "./ng-m-datatable.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [NgMDatatable],
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatFormFieldModule,
    MatChipsModule,
  ],
  exports: [NgMDatatable],
})
export class NgMDatatableModule {}
