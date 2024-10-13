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
import Swal from 'sweetalert2';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    SharedModule,
    TopbarComponent,
    SidebarComponent,
    RouterLink,
    NgxPaginationModule,
    AngularMultiSelectModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {

  Form: any;
  settings: any = {};
  options: any = {};
  page: number = 1;
  imgurl: any;
  result: any = {
    companies: [],
    organization: [],
    industries: []
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

    this.options.verification = [
      { "id": 1, "name": "Verified", "value": "verified" },
      { "id": 2, "name": "Un-Verified", "value": "un-verified" },
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
    this.settings.organization = { ...defaultSettings, text: "Select Organization Type", };
    this.settings.industry = { ...defaultSettings, text: "Select Industry Type", };
    this.settings.verification = { ...defaultSettings, text: "Select Verification Status", };
  }

  ngOnInit(): void {
    this.Form = this.fb.group({
      company_name: [''],
      organization_id: [''],
      industry_id: [''],
      is_verified: ['']
    });
    this.get_organizations();
  }

  public async get_organizations() {
    try {
      const res = await this.api.api_actions('get', '', 'organizations', true, false);
      if (res?.status == true) {
        this.result.organizations = res?.res?.data;
      } else {
        //
      }
      this.get_industries();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_industries() {
    try {
      const res = await this.api.api_actions('get', '', 'industries', true, false);
      if (res?.status == true) {
        this.result.industries = res?.res?.data;
      } else {
        //
      }
      this.get_companies();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_companies() {
    const data = {
      'page': this.page,
      'column': this.column,
      'dir': this.dir,
      'per_page': this.per_page,
      'company_name': this.Form.get('company_name')?.value ? this.Form.get('company_name').value : '',
      'organization_id': this.Form.get('organization_id')?.value?.length ? this.Form.get('organization_id').value[0].id : '',
      'industry_id': this.Form.get('industry_id')?.value?.length ? this.Form.get('industry_id').value[0].id : '',
      'is_verified': this.Form.get('is_verified')?.value?.length ? this.Form.get('is_verified').value[0].value : ''
    };
    try {
      const res = await this.api.api_actions('get', data, 'companies', true, false);
      if (res?.status == true) {
        this.result.companies = res?.res?.data;
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

  onSearch($ev: any) {
    console.log($ev)
  }

  public async delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      toast: true,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.do_delete(id);
      }
    });
  }

  public async do_delete(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('delete', data, 'companies', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_companies();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async activate_user($ev: any) {
    $ev.user.status = $ev?.user?.status === 'active' ? 'in-active' : 'active';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this user status?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel',
      toast: true,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.do_active($ev.user_id);
      }
    });
  }

  public async do_active(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_company_status', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_companies();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async modify_verification($ev: any) {
    $ev.user.email_verified_at = $ev?.user?.email_verified_at != null ? null : 'Not Verified';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update user verification?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel',
      toast: true,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.do_modify($ev.user_id);
      }
    });
  }

  public async do_modify(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_company_verification', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_companies();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  /* common */

  public doSort(col: string) {
    this.column = col;
    this.dir = (this.dir == 'desc') ? 'asc' : 'desc';
    this.get_companies();
  }

  onItemsPerPageChange(ev: any) {
    this.per_page = ev.target.value;
    this.get_companies();
  }

  public onPageChange(ev: any) {
    this.page = ev;
    this.get_companies();
  }

  resetFilters() {
    this.Form.reset();
    this.get_companies();
  }

  onItemSelect(ev: any) {
    this.get_companies();
  }

  OnItemDeSelect(ev: any) {
    this.get_companies();
  }

}
