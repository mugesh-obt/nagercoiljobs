import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import moment from 'moment';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';

@Component({
  selector: 'app-candidate-add',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    AngularMultiSelectModule,
    TopbarComponent,
    SidebarComponent,
    NgxEditorModule,
  ],
  providers: [Editor],
  templateUrl: './candidate-add.component.html',
  styleUrl: './candidate-add.component.scss'
})
export class CandidateAddComponent implements OnInit, OnDestroy {

  Form: any;
  err: any = {};
  settings: any = {};
  options: any = {};
  result: any = {
    professions: [],
    educations: [],
    skills: [],
    job_roles: []
  };
  resume: any = {
    preview: 'assets/images/pdf.png',
    browse: false,
    delete: false
  }
  bioeditor!: Editor;
  toolbar!: Toolbar;

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
    this.settings.profession = { ...defaultSettings, text: "Select Profession" };
    this.settings.education = { ...defaultSettings, text: "Select Education", singleSelection: false };
    this.settings.skill = { ...defaultSettings, text: "Select Skill", singleSelection: false };
    this.settings.experience = { ...defaultSettings, text: "Select Experience" };
    this.settings.job_role = { ...defaultSettings, text: "Select Job Role" };
    this.settings.gender = { ...defaultSettings, text: "Select Gender" };
    this.settings.languages = { ...defaultSettings, text: "Select Languages", singleSelection: false };
    this.settings.marital_status = { ...defaultSettings, text: "Select Marital Status" };
  }

  ngOnInit() {
    this.bioeditor = new Editor();
    this.Form = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      location: [''],
      resume: [''],
      profession_id: [''],
      education: [''],
      dob: [''],
      skills: [''],
      website: [''],
      experience: [''],
      job_role_id: [''],
      gender: [''],
      languages: [''],
      bio: [''],
      marital_status: ['']
    });
    this.get_professions();
  }

  ngOnDestroy(): void {
    this.bioeditor.destroy();
  }

  public async get_professions() {
    try {
      const res = await this.api.api_actions('get', '', 'professions', true, false);
      if (res?.status == true) {
        this.result.professions = res?.res?.data;
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
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async dosubmit() {
    const $d = this.Form.get('dob')?.value;
    const data: any = {
      'name': this.Form.get('name')?.value ? this.Form.get('name').value : '',
      'email': this.Form.get('email')?.value ? this.Form.get('email').value : '',
      'password': this.Form.get('password')?.value ? this.Form.get('password').value : '',
      'resume': this.Form.get('resume')?.value ? this.Form.get('resume').value : '',
      'location': this.Form.get('location')?.value ? this.Form.get('location').value : '',
      'website': this.Form.get('website')?.value ? this.Form.get('website').value : '',
      'profession_id': this.Form.get('profession_id')?.value?.length ? this.Form.get('profession_id').value[0].id : '',
      'dob': $d.startDate ? moment($d.startDate.$d).format('YYYY-MM-DD') : '',
      'experience': this.Form.get('experience')?.value?.length ? this.Form.get('experience').value[0].value : '',
      'job_role_id': this.Form.get('job_role_id')?.value?.length ? this.Form.get('job_role_id').value[0].id : '',
      'gender': this.Form.get('gender')?.value?.length ? this.Form.get('gender').value[0].value : '',
      'bio': this.Form.get('bio')?.value ? this.Form.get('bio').value : '',
      'marital_status': this.Form.get('marital_status')?.value?.length ? this.Form.get('marital_status').value[0].value : '',
    };
    this.Form.get('education')?.value.length ? this.makearr(this.Form.get('education').value).forEach((item: any, i: any) => { data[`education[${i}]`] = item }) : data['education[]'] = '';
    this.Form.get('skills')?.value.length ? this.makearr(this.Form.get('skills').value).forEach((item: any, i: any) => { data[`skills[${i}]`] = item }) : data['skills[]'] = '';
    this.Form.get('languages')?.value.length ? this.make_lang_arr(this.Form.get('languages').value).forEach((item: any, i: any) => { data[`languages[${i}]`] = item }) : data['languages[]'] = '';
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'candidates', true, true);
      if (res?.status == true) {
        this.router.navigate(['/candidates']);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  public onResumeChange($ev: any) {
    const reader = new FileReader();
    if ($ev.target.files && $ev.target.files.length) {
      const [file] = $ev.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.resume.preview = reader.result as string;
        this.Form.get('resume').value = $ev.target.files[0];
        this.resume.delete = true;
        this.resume.browse = false;
      };
    }
  }

  cancelResume() {
    this.resume.preview = 'assets/images/pdf.png';
    this.Form.get('resume').value = '';
    this.resume.delete = false;
    this.resume.browse = true;
  }

  makearr(val: any) {
    let arr = val.map((x: any) => x.id);
    return arr;
  }

  make_lang_arr(val: any) {
    let arr = val.map((x: any) => x.value);
    return arr;
  }

}
