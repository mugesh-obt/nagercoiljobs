import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import moment from 'moment';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';

@Component({
  selector: 'app-job-add',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    AngularMultiSelectModule,
    TopbarComponent,
    SidebarComponent,
    NgxEditorModule,
  ],
  templateUrl: './job-add.component.html',
  styleUrl: './job-add.component.scss'
})
export class JobAddComponent implements OnInit, OnDestroy {

  Form: any;
  err: any = {};
  settings: any = {};
  options: any = {};
  result: any = {
    companies: [],
    job_categories: [],
    job_roles: [],
    educations: [],
    job_types: [],
    tags: [],
    benefits: [],
    skills: []
  };
  descriptioneditor!: Editor;
  toolbar!: Toolbar;

  activeSection: any;
  salaryrange: boolean = true;
  companydropdown: boolean = true;

  constructor(
    public fb: FormBuilder,
    public api: BackendService,
    private router: Router) {

    this.toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    this.options.salary_type = [
      { "id": 1, "name": "Project Based", "value": "project_based" },
      { "id": 2, "name": "Monthly", "value": "monthly" },
      { "id": 3, "name": "Yearly", "value": "yearly" },
    ];

    this.options.receive_application = [
      { "id": 1, "name": "On Our Platform", "value": "on_our_platform" },
      { "id": 2, "name": "On Our Mail Address", "value": "on_our_mail_address" },
      { "id": 3, "name": "On Custom Url", "value": "on_custom_url" },
    ];

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
    this.settings.company = { ...defaultSettings, primaryKey: 'user_id', labelKey: 'company_name', text: "Select Company" };
    this.settings.job_category = { ...defaultSettings, text: "Select Job Category" };
    this.settings.job_role = { ...defaultSettings, text: "Select Job Role" };
    this.settings.education = { ...defaultSettings, text: "Select Education", singleSelection: false };
    this.settings.job_type = { ...defaultSettings, text: "Select Job Type" };
    this.settings.tag = { ...defaultSettings, text: "Select Tags", singleSelection: false };
    this.settings.benefit = { ...defaultSettings, text: "Select Benefits", singleSelection: false };
    this.settings.skill = { ...defaultSettings, text: "Select Skills", singleSelection: false };
    this.settings.salary_type = { ...defaultSettings, text: "Select Salary Type" };
    this.settings.receive_application = { ...defaultSettings, text: "Select Receive Application" };
    this.settings.experience = { ...defaultSettings, text: "Select Experience" };
  }

  ngOnInit() {
    this.descriptioneditor = new Editor();
    this.Form = this.fb.group({
      title: [''],
      company_id: [''],
      company_name: [''],
      category_id: [''],
      total_vacancies: [''],
      deadline: [''],
      location: [''],
      salary: ['salary_range'],
      min_salary: [''],
      max_salary: [''],
      custom_salary: [''],
      salary_type: [''],
      experience: [''],
      job_role_id: [''],
      education: [''],
      job_type_id: [''],
      tags: [''],
      skills: [''],
      receive_applications: [''],
      promote: this.fb.array([]),
      description: [''],
      benefits_id: ['']
    });
    this.get_companies();
  }

  ngOnDestroy(): void {
    this.descriptioneditor.destroy();
  }

  public async get_companies() {
    try {
      const res = await this.api.api_actions('get', '', 'companies', true, false);
      if (res?.status == true) {
        this.result.companies = res?.res?.data;
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
      this.get_educations();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_educations() {
    try {
      const res = await this.api.api_actions('get', '', 'educations', true, false);
      if (res?.status == true) {
        this.result.educations = res?.res?.data;
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
      this.get_tags();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_tags() {
    try {
      const res = await this.api.api_actions('get', '', 'tags', true, false);
      if (res?.status == true) {
        this.result.tags = res?.res?.data;
      } else {
        //
      }
      this.get_benefits();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_benefits() {
    try {
      const res = await this.api.api_actions('get', '', 'benefits', true, false);
      if (res?.status == true) {
        this.result.benefits = res?.res?.data;
      } else {
        //
      }
      this.get_skills();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_skills() {
    try {
      const res = await this.api.api_actions('get', '', 'skills', true, false);
      if (res?.status == true) {
        this.result.skills = res?.res?.data;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async dosubmit() {
    const $d = this.Form.get('deadline')?.value;
    const data = {
      'title': this.Form.get('title')?.value ? this.Form.get('title').value : '',
      'company_id': this.Form.get('company_id')?.value?.length ? this.Form.get('company_id').value[0].id : '',
      'company_name': this.Form.get('company_name')?.value ? this.Form.get('company_name').value : '',
      'category_id': this.Form.get('category_id')?.value?.length ? this.Form.get('category_id').value[0].id : '',
      'total_vacancies': this.Form.get('total_vacancies')?.value ? this.Form.get('total_vacancies').value : '',
      'deadline': $d.startDate ? moment($d.startDate.$d).format('YYYY-MM-DD') : '',
      'location': this.Form.get('location')?.value ? this.Form.get('location').value : '',
      'salary': this.Form.get('salary')?.value ? this.Form.get('salary').value : '',
      'min_salary': this.Form.get('min_salary')?.value ? this.Form.get('min_salary').value : '',
      'max_salary': this.Form.get('max_salary')?.value ? this.Form.get('max_salary').value : '',
      'custom_salary': this.Form.get('custom_salary')?.value ? this.Form.get('custom_salary').value : '',
      'salary_type': this.Form.get('salary_type')?.value?.length ? this.Form.get('salary_type').value[0].value : '',
      'experience': this.Form.get('experience')?.value?.length ? this.Form.get('experience').value[0].value : '',
      'job_role_id': this.Form.get('job_role_id')?.value?.length ? this.Form.get('job_role_id').value[0].id : '',
      'education': this.Form.get('education')?.value?.length ? this.Form.get('education').value[0].id : '',
      'job_type_id': this.Form.get('job_type_id')?.value?.length ? this.Form.get('job_type_id').value[0].id : '',
      'tags': this.Form.get('tags')?.value?.length ? this.Form.get('tags').value[0].id : '',
      'skills': this.Form.get('skills')?.value?.length ? this.Form.get('skills').value[0].id : '',
      'receive_applications': this.Form.get('receive_applications')?.value?.length ? this.Form.get('receive_applications').value[0].value : '',
      'promote': this.Form.get('promote')?.value ? this.Form.get('promote').value : '',
      'description': this.Form.get('description')?.value ? this.Form.get('description').value : '',
      'benefits_id': this.Form.get('benefits_id')?.value?.length ? this.Form.get('benefits_id').value[0].id : ''
    };
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'jobs', true, true);
      if (res?.status == true) {
        this.router.navigate(['/jobs']);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  toggleSalaryInput($ev: any) {
    this.salaryrange = ($ev.target.value) == 'salary_range' ? true : false;
  }

  withoutCompany($ev: any) {
    this.companydropdown = ($ev.target.checked) ? false : true;
  }

  togglePromoteInput($ev: any) {
    const promoteFormArray = this.Form.get('promote') as FormArray;

    if ($ev.target.checked) {
      promoteFormArray.push(new FormControl($ev.target.value));
    } else {
      const index = promoteFormArray.controls.findIndex(control => control.value === $ev.target.value);
      if (index !== -1) {
        promoteFormArray.removeAt(index);
      }
    }
  }

}
