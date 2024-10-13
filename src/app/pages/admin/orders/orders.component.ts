/* common */
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TopbarComponent } from '../../common/topbar/topbar.component';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { FormBuilder } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { environment } from '../../../../environments/environment.development';
import moment from 'moment';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    SharedModule,
    TopbarComponent,
    SidebarComponent,
    RouterLink,
    NgxPaginationModule,
    AngularMultiSelectModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  Form: any;
  settings: any = {};
  options: any = {};
  page: number = 1;
  imgurl: any;
  result: any = {
    companies: [],
    plans: [],
    orders: []
  };
  /* common */
  column: string = 'id';
  dir: string = 'desc';
  per_page: number = 10;
  perPageOptions: number[] = [10, 25, 50, 100];
  showing: any = { 'from': 0, 'to': 0, 'total': 0 };

  constructor(
    public api: BackendService,
    private fb: FormBuilder) {

    this.imgurl = environment.imgUrl;

    this.options.provider = [
      { "id": 1, "name": "Paypal", "value": "paypal" },
      { "id": 2, "name": "Stripe", "value": "stripe" },
      { "id": 3, "name": "Razorpay", "value": "razorpay" },
      { "id": 4, "name": "Paystack", "value": "paystack" },
      { "id": 5, "name": "SSL Commerz", "value": "ssl commerz" },
      { "id": 6, "name": "Instamojo", "value": "instamojo" },
      { "id": 7, "name": "Flutterwave", "value": "flutterwave" },
      { "id": 8, "name": "Mollie", "value": "mollie" },
      { "id": 9, "name": "Midtrans", "value": "midtrans" },
      { "id": 10, "name": "Offline", "value": "offline" }
    ];

    const defaultSettings = {
      singleSelection: true,
      primaryKey: 'id',
      labelKey: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      noDataLabel: 'No Data Available',
      autoPosition: true
    };
    this.settings.provider = { ...defaultSettings, text: "Select Payment Provider", };
    this.settings.company = { ...defaultSettings, primaryKey: 'user_id', labelKey: 'company_name', text: "Select Company", };
    this.settings.plan = { ...defaultSettings, labelKey: 'label', text: "Select Plan", };
  }

  ngOnInit(): void {
    this.Form = this.fb.group({
      company: [''],
      payment_method: [''],
      plan: ['']
    });
    this.get_companies();
  }

  public async get_companies() {
    try {
      const res = await this.api.api_actions('get', '', 'companies', true, false);
      if (res?.status == true) {
        this.result.companies = res?.res?.data;
      } else {
        //
      }
      this.get_plans();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_plans() {
    try {
      const res = await this.api.api_actions('get', '', 'plans', true, false);
      if (res?.status == true) {
        this.result.plans = res?.res?.data;
      } else {
        //
      }
      this.get_orders();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_orders() {
    const data = {
      'page': this.page,
      'column': this.column,
      'dir': this.dir,
      'per_page': this.per_page,
      'company': this.Form.get('company')?.value?.length ? this.Form.get('company').value[0].user_id : '',
      'payment_method': this.Form.get('payment_method')?.value?.length ? this.Form.get('payment_method').value[0].value : '',
      'plan': this.Form.get('plan')?.value?.length ? this.Form.get('plan').value[0].id : ''
    };
    try {
      const res = await this.api.api_actions('get', data, 'orders', true, false);
      if (res?.status == true) {
        this.result.orders = res?.res?.data;
        this.showing.from = res?.res?.from;
        this.showing.to = res?.res?.to;
        this.showing.total = res?.res?.total;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public created_time(time: any) {
    return moment(time).fromNow();
  }

  /* common */

  public doSort(col: string) {
    this.column = col;
    this.dir = (this.dir == 'desc') ? 'asc' : 'desc';
    this.get_orders();
  }

  onItemsPerPageChange(ev: any) {
    this.per_page = ev.target.value;
    this.get_orders();
  }

  public onPageChange(ev: any) {
    this.page = ev;
    this.get_orders();
  }

  resetFilters() {
    this.Form.reset();
    this.get_orders();
  }

  onItemSelect(ev: any) {
    this.get_orders();
  }

  OnItemDeSelect(ev: any) {
    this.get_orders();
  }



}
