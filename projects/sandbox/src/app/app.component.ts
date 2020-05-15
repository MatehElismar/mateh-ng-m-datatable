import { Component, ViewChild, AfterViewInit } from "@angular/core";
import {
  NgMDatatable,
  TextColumn,
  ActionColumn,
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
export class AppComponent implements AfterViewInit {
  title = "Sandbox NgMDataTable";

  @ViewChild(NgMDatatable) DataTable: NgMDatatable<Modelo>;
  tablecolumns: Array<TextColumn | ActionColumn<Modelo>> = [
    { id: "balance", text: "Balance", type: "text" },
    { id: "age", text: "Edad", type: "text" },
    { id: "eyeColor", text: "Color de Ojos" },
    { id: "name", text: "Nombre" },
    { id: "gender", text: "Genero", type: "text" },
    {
      id: "action",
      text: "Actopms",
      type: "action",
      actions: [
        {
          text: "Edit",
          icon: "edit",
          handler: (data) => {
            console.log("Pressed Edit", data);
          },
        },
      ],
    },
  ];

  displayedColumns = ["balance", "age", "eyeColor", "name", "gender", "action"];

  data = [];

  ngAfterViewInit() {
    this.DataTable.title = "Datatable Title!";
    this.DataTable.loadingColor = "blue";
    this.DataTable.addButton = {
      icon: "add",
      handler: () => {
        console.log("se preciono el boton de agregar");
      },
    };
    setTimeout(() => {
      this.data = [
        {
          balance: "$3,845.96",
          age: 33,
          eyeColor: "brown",
          name: "Valarie Santos",
          gender: "female",
          company: "ELEMANTRA",
          email: "valariesantos@elemantra.com",
          phone: "+1 (816) 420-3640",
          address: "252 Wilson Street, Dunlo, American Samoa, 8802",
        },
        {
          _id: "5eb870ca030ad304ccf6c41f",
          index: 1,
          guid: "1e01a170-9027-4025-a8c8-256940e8bc9a",
          isActive: true,
          balance: "$1,859.91",
          picture: "http://placehold.it/32x32",
          age: 34,
          eyeColor: "brown",
          name: "Mason Valentine",
          gender: "male",
          company: "RECRISYS",
          email: "masonvalentine@recrisys.com",
          phone: "+1 (829) 416-3339",
          address: "903 Prospect Street, Shasta, Illinois, 397",
        },
        {
          _id: "5eb870ca1ef8938fe7e0e02d",
          index: 2,
          guid: "eae7121a-804f-403e-8098-d1c9d03ad213",
          isActive: false,
          balance: "$3,157.01",
          picture: "http://placehold.it/32x32",
          age: 29,
          eyeColor: "blue",
          name: "Audra Duran",
          gender: "female",
          company: "MEDIFAX",
          email: "audraduran@medifax.com",
          phone: "+1 (896) 566-2090",
          address: "862 Forbell Street, Mayfair, Virgin Islands, 4836",
        },
        {
          _id: "5eb870caa16c2cae2cd989fe",
          index: 3,
          guid: "3d4302ec-c2bf-4714-998e-ebf9da03c7bb",
          isActive: true,
          balance: "$2,228.88",
          picture: "http://placehold.it/32x32",
          age: 21,
          eyeColor: "brown",
          name: "Maddox Olsen",
          gender: "male",
          company: "MINGA",
          email: "maddoxolsen@minga.com",
          phone: "+1 (979) 475-3654",
          address: "792 Newkirk Placez, Clayville, Idaho, 2083",
        },
        {
          _id: "5eb870ca9e60282f8ec9675a",
          index: 4,
          guid: "d4eaff05-1994-4b16-8202-62fe381fe6a8",
          isActive: true,
          balance: "$2,600.84",
          picture: "http://placehold.it/32x32",
          age: 37,
          eyeColor: "brown",
          name: "Corinne Puckett",
          gender: "female",
          company: "EARGO",
          email: "corinnepuckett@eargo.com",
          phone: "+1 (860) 542-3190",
          address: "457 Lacon Court, Greenfields, Oregon, 9401",
        },
        {
          _id: "5eb870caee1cb7fba68c28fb",
          index: 5,
          guid: "d70dd211-4d71-40a4-bea6-90d1955dacf6",
          isActive: false,
          balance: "$3,095.16",
          picture: "http://placehold.it/32x32",
          age: 30,
          eyeColor: "blue",
          name: "Harrington Cannon",
          gender: "male",
          company: "AUSTEX",
          email: "harringtoncannon@austex.com",
          phone: "+1 (813) 517-3004",
          address: "867 Locust Avenue, Finderne, Alaska, 5425",
        },
      ];
    }, 2000);
  }
}
