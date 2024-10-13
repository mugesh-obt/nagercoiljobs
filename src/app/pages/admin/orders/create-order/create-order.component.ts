import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import moment from 'moment';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    AngularMultiSelectModule,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnInit {

  Form: any;
  err: any = {};
  settings: any = {};
  options: any = {};
  payment_providers: any = [];
  statuses: any = [];
  result: any = {
    companies: [],
    plans: []
  };

  constructor(
    public fb: FormBuilder,
    public api: BackendService,
    private router: Router) {

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

    this.options.status = [
      { "id": 1, "name": "Pending", "value": "pending" },
      { "id": 2, "name": "Processing", "value": "processing" },
      { "id": 3, "name": "Completed", "value": "completed" },
      { "id": 1, "name": "Failed", "value": "failed" },
      { "id": 2, "name": "Cancelled", "value": "cancelled" },
      { "id": 3, "name": "Refunded", "value": "refunded" },
      { "id": 3, "name": "Expired", "value": "expired" }
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
    this.settings.status = { ...defaultSettings, text: "Select Status", };
  }

  ngOnInit() {
    this.Form = this.fb.group({
      user_id: [''],
      plan_id: [''],
      activated_date: [''],
      payment_method: [''],
      order_note: [''],
      status: [''],
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
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async dosubmit() {
    const $d = this.Form.get('activated_date')?.value;
    const data = {
      'user_id': this.Form.get('user_id')?.value?.length ? this.Form.get('user_id').value[0].user_id : '',
      'plan_id': this.Form.get('plan_id')?.value?.length ? this.Form.get('plan_id').value[0].id : '',
      'activated_date': $d.startDate ? moment($d.startDate.$d).format('YYYY-MM-DD') : '',
      'payment_method': this.Form.get('payment_method')?.value?.length ? this.Form.get('payment_method').value[0].value : '',
      'order_note': this.Form.get('order_note')?.value,
      'status': this.Form.get('status')?.value?.length ? this.Form.get('status').value[0].value : ''
    };
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'orders', true, true);
      if (res?.status == true) {
        this.router.navigate(['/orders']);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

}
