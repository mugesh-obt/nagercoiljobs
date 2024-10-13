import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxLoadingModule } from "ngx-loading";

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    NgxLoadingModule.forRoot({
      backdropBorderRadius: "14px"
    }),
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxDaterangepickerMd,
    NgxLoadingModule,
  ]
})
export class SharedModule { }
