import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import Swal from 'sweetalert2';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    NgxPaginationModule,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.scss'
})
export class CompanyViewComponent implements OnInit {

  id: any;
  result: any = {
    industries: [],
    job_categories: [],
    job_roles: [],
    company: []
  };
  imgurl: any;
  options: any = {};

  constructor(
    public api: BackendService,
    private activeRouter: ActivatedRoute) {

    this.imgurl = environment.imgUrl;
    this.id = this.activeRouter.snapshot.paramMap.get('id');

    this.options.team_size = [
      { "id": 1, "name": "Only me", "value": "only-me" },
      { "id": 1, "name": "10 Members", "value": "10" },
      { "id": 1, "name": "10-20 Members", "value": "10-20" },
      { "id": 1, "name": "20-50 Members", "value": "20-50" },
      { "id": 1, "name": "50-100 Members", "value": "50-100" },
      { "id": 1, "name": "100-200 Members", "value": "100-200" },
      { "id": 1, "name": "200-500 Members", "value": "200-500" },
      { "id": 1, "name": "500+ Members", "value": "500+" }
    ];
  }

  ngOnInit(): void {
    this.get_industries();
  }

  public async get_industries() {
    try {
      const res = await this.api.api_actions('get', '', 'industries', true, false);
      if (res?.status == true) {
        this.result.industries = res?.res?.data;
      } else {
        //
      }
      this.get_job_categories();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_job_categories() {
    try {
      const res = await this.api.api_actions('get', '', 'job_categories', true, false);
      if (res?.status == true) {
        this.result.job_categories = res?.res?.data;
      } else {
        //
      }
      this.get_job_roles();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_job_roles() {
    try {
      const res = await this.api.api_actions('get', '', 'job_roles', true, false);
      if (res?.status == true) {
        this.result.job_roles = res?.res?.data;
      } else {
        //
      }
      this.get_company();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_company() {
    let data = { 'id': this.id }
    try {
      const res = await this.api.api_actions('get', data, 'companies', true, false);
      if (res?.status == true) {
        this.result.company = res?.data;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public get_teamsize(val: any) {
    const teamsize = this.options.team_size.find((x: any) => x.value === val);
    return teamsize.name;
  }

  public get_industry(id: any) {
    const industry = this.result.industries.find((x: any) => x.id === id);
    return industry.name;
  }

  public get_job_category(id: any) {
    const industry = this.result.job_categories.find((x: any) => x.id === id);
    return industry.name;
  }

  public get_job_role(id: any) {
    const industry = this.result.job_roles.find((x: any) => x.id === id);
    return industry.name;
  }

  public async change_job_status($ev: any) {
    $ev.status = $ev.status === 'active' ? 'in-active' : 'active';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this job status?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel',
      toast: true,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.update_job_status($ev.id);
      }
    });
  }

  public async update_job_status(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_job_status', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async activate_user(id: any) {
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
        this.do_active(id);
      }
    });
  }

  public async do_active(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_company_status', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async modify_verification(id: any) {
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
        this.do_modify(id);
      }
    });
  }

  public async do_modify(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_company_verification', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
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
      const res = await this.api.api_actions('delete', data, 'jobs', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_company();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

}
