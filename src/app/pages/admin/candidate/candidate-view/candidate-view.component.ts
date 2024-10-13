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
  selector: 'app-candidate-view',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    NgxPaginationModule,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './candidate-view.component.html',
  styleUrl: './candidate-view.component.scss'
})
export class CandidateViewComponent implements OnInit {

  id: any;
  result: any = {
    professions: [],
    skills: [],
    educations: [],
    job_roles: [],
    candidate: [],
    job_categories: []
  };
  imgurl: any;
  options: any = {};

  constructor(
    public api: BackendService,
    private activeRouter: ActivatedRoute) {

    this.imgurl = environment.imgUrl;
    this.id = this.activeRouter.snapshot.paramMap.get('id');

    this.options.gender = [
      { "id": 1, "name": "Male", "value": "male" },
      { "id": 2, "name": "Female", "value": "female" },
      { "id": 3, "name": "Others", "value": "others" },
    ];

    this.options.marital_status = [
      { "id": 1, "name": "Married", "value": "married" },
      { "id": 2, "name": "Un Married", "value": "un-married" },
    ];

    this.options.languages = [
      { "id": 1, "name": "English", "value": "english" },
      { "id": 2, "name": "Mandarin", "value": "mandarin" },
      { "id": 3, "name": "Hindi", "value": "hindi" },
      { "id": 4, "name": "Spanish", "value": "spanish" },
      { "id": 5, "name": "French", "value": "french" },
      { "id": 6, "name": "Arabic", "value": "arabic" },
      { "id": 7, "name": "Bengali", "value": "bengali" },
      { "id": 8, "name": "Portuguese", "value": "portuguese" },
      { "id": 9, "name": "Russian", "value": "russian" },
      { "id": 10, "name": "Japanese", "value": "japanese" }
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
  }

  ngOnInit(): void {
    this.get_professions();
  }

  public async get_professions() {
    try {
      const res = await this.api.api_actions('get', '', 'professions', true, false);
      if (res?.status == true) {
        this.result.professions = res?.res?.data;
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
      this.get_candidate();
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async get_candidate() {
    let data = { 'id': this.id }
    try {
      const res = await this.api.api_actions('get', data, 'candidates', true, false);
      if (res?.status == true) {
        this.result.candidate = res?.data;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public get_profession(id: any) {
    const profession = this.result?.professions.find((x: any) => x.id === id);
    return profession?.name || '';
  }

  public get_experience(val: any) {
    const experience = this.options.experience.find((x: any) => x.value === val);
    return experience?.name || '';
  }

  public get_marital_status(val: any) {
    const marital_status = this.options.marital_status.find((x: any) => x.value === val);
    return marital_status?.name || '';
  }

  public get_gender(val: any) {
    const gender = this.options.gender.find((x: any) => x.value === val);
    return gender?.name || '';
  }

  public get_education(ids: any = []) {
    const educations = this.result?.educations?.filter((x: any) => ids.includes(String(x.id))) || [];
    return educations.length ? educations.map((x: any) => x.name).join(', ') : '';
  }

  public get_skill(ids: any = []) {
    const skills = this.result?.skills?.filter((x: any) => ids.includes(String(x.id))) || [];
    return skills.length ? skills.map((x: any) => x.name).join(', ') : '';
  }

  public get_languages(vals: any = []) {
    const languages = this.options?.languages?.filter((x: any) => vals.includes(x.value)) || [];
    return languages.length ? languages.map((x: any) => x.name).join(', ') : '';
  }

  public get_job_category(id: any) {
    const job_category = this.result?.job_categories.find((x: any) => x.id === id);
    return job_category?.name || '';
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

}
