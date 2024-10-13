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
  selector: 'app-jobs',
  standalone: true,
  imports: [
    SharedModule,
    TopbarComponent,
    SidebarComponent,
    RouterLink,
    NgxPaginationModule,
    AngularMultiSelectModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit {

  Form: any;
  settings: any = {};
  options: any = {};
  page: number = 1;
  imgurl: any;
  result: any = {
    jobs: [],
    job_categories: [],
    job_types: []
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

    this.options.experience = [
      { "id": 1, "name": "Fresher", "value": "fresher" },
      { "id": 2, "name": "1 Year", "value": "1" },
      { "id": 3, "name": "2 Year", "value": "2" },
      { "id": 4, "name": "3+ Year", "value": "3+" },
      { "id": 5, "name": "5+ Year", "value": "5+" },
      { "id": 6, "name": "8+ Year", "value": "8+" },
      { "id": 7, "name": "10+ Year", "value": "10+" },
      { "id": 8, "name": "15+ Year", "value": "15+" },
    ];

    this.options.status = [
      { "id": 1, "name": "Active", "value": "active" },
      { "id": 2, "name": "In active", "value": "in-active" },
      { "id": 3, "name": "Expired", "value": "expired" },
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
    this.settings.job_category = { ...defaultSettings, text: "Select Job Category", };
    this.settings.job_type = { ...defaultSettings, text: "Select Job Type", };
    this.settings.experience = { ...defaultSettings, text: "Select Experience", };
    this.settings.status = { ...defaultSettings, text: "Select Status", };
  }

  ngOnInit(): void {
    this.Form = this.fb.group({
      title: [''],
      job_category: [''],
      job_type: [''],
      experience: [''],
      status: [''],
    });
    this.get_job_categories();
  }

  public async get_job_categories() {
    try {
      const res = await this.api.api_actions('get', '', 'job_categories', true, false);
      if (res?.status == true) {
        this.result.job_categories = res?.res?.data;
      } else {
        //
      }
      this.get_job_types();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_job_types() {
    try {
      const res = await this.api.api_actions('get', '', 'job_types', true, false);
      if (res?.status == true) {
        this.result.job_types = res?.res?.data;
      } else {
        //
      }
      this.get_jobs();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_jobs() {
    const data = {
      'page': this.page,
      'column': this.column,
      'dir': this.dir,
      'per_page': this.per_page,
      'company_name': this.Form.get('title')?.value ? this.Form.get('title').value : '',
      'job_category': this.Form.get('job_category')?.value?.length ? this.Form.get('job_category').value[0].id : '',
      'job_type': this.Form.get('job_type')?.value?.length ? this.Form.get('job_type').value[0].id : '',
      'experience': this.Form.get('experience')?.value?.length ? this.Form.get('experience').value[0].value : '',
      'status': this.Form.get('status')?.value?.length ? this.Form.get('status').value[0].value : ''
    };
    try {
      const res = await this.api.api_actions('get', data, 'jobs', true, false);
      if (res?.status == true) {
        this.result.jobs = res?.res?.data;
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
        this.get_jobs();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async activate_job($ev: any) {
    $ev.status = $ev?.status === 'active' ? 'in-active' : 'active';
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
        this.do_active($ev.id);
      }
    });
  }

  public async do_active(id: any) {
    let data = { 'id': id }
    try {
      const res = await this.api.api_actions('patch', data, 'modify_job_status', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_jobs();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  get_category(id: any) {
    const category = this.result.job_categories.find((x: any) => x.id === id);
    return category.name;
  }

  selectedJobs: Set<number> = new Set();

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.result.jobs.forEach((job: any) => {
      job.selected = checked;
      if (checked) {
        this.selectedJobs.add(job.id);
      } else {
        this.selectedJobs.delete(job.id);
      }
    });
  }

  public async deleteSelected() {
    const jobstoDelete = this.result.jobs.filter((job: any) => job.selected);
    let data: any = {};
    jobstoDelete.length ? jobstoDelete.forEach((item: any, i: any) => { data[`job_ids[${i}]`] = item.id }) : data['job_ids[]'] = '';
    try {
      const res = await this.api.api_actions('post', data, 'multi_jobs_delete', true, false);
      if (res?.status == true) {
        this.api.popupOpen('success', res.message);
        this.get_jobs();
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
    this.get_jobs();
  }

  onItemsPerPageChange(ev: any) {
    this.per_page = ev.target.value;
    this.get_jobs();
  }

  public onPageChange(ev: any) {
    this.page = ev;
    this.get_jobs();
  }

  resetFilters() {
    this.Form.reset();
    this.get_jobs();
  }

  onItemSelect(ev: any) {
    this.get_jobs();
  }

  OnItemDeSelect(ev: any) {
    this.get_jobs();
  }

}
