import { BrowserModule } from "@angular/platform-browser";

import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgMDatatableModule } from "projects/ng-m-datatable/src/public-api";
import { TestComponent } from "projects/sandbox/src/app/test/test.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "test",
    component: TestComponent,
  },
];

@NgModule({
  declarations: [AppComponent, TestComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgMDatatableModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
