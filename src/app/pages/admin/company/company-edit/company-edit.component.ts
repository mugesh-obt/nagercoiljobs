import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';
import moment from 'moment';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-company-edit',
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
  templateUrl: './company-edit.component.html',
  styleUrl: './company-edit.component.scss'
})
export class CompanyEditComponent implements OnInit, OnDestroy {

  Form: any;
  err: any = {};
  settings: any = {};
  options: any = [];
  result: any = {
    organizations: [],
    industries: []
  };
  logo: any = {
    preview: 'assets/images/no-picture.png',
    browse: false,
    delete: false
  }
  banner: any = {
    preview: 'assets/images/no-picture.png',
    browse: false,
    delete: false
  }
  bioeditor!: Editor;
  visioneditor!: Editor;
  toolbar!: Toolbar;
  id: any;
  imgurl: any;

  constructor(
    public fb: FormBuilder,
    public api: BackendService,
    private router: Router,
    private activeRouter: ActivatedRoute) {

    this.id = this.activeRouter.snapshot.paramMap.get('id');
    this.imgurl = environment.imgUrl;

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
    this.settings.organization = { ...defaultSettings, text: "Select Organization", };
    this.settings.industry = { ...defaultSettings, text: "Select Industry", };
    this.settings.team_size = { ...defaultSettings, text: "Select Team size", };
  }

  ngOnInit() {
    this.bioeditor = new Editor();
    this.visioneditor = new Editor();
    this.Form = this.fb.group({
      company_name: [''],
      name: [''],
      email: [''],
      password: [''],
      logo: [''],
      banner: [''],
      location: [''],
      company_phone: [''],
      company_email: [''],
      website: [''],
      organization_id: [''],
      industry_id: [''],
      team_size: [''],
      establishment_date: [''],
      bio: [''],
      vision: ['']
    });
    this.get_organizations();
  }

  ngOnDestroy(): void {
    this.bioeditor.destroy();
    this.visioneditor.destroy();
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
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
    this.get_company();
  }

  public async get_company() {
    let data = { 'id': this.id }
    try {
      const res = await this.api.api_actions('get', data, 'companies', true, false);
      if (res?.status == true) {
        const company = res?.data;
        const organization = this.result.organizations.filter((x: any) => x.id === company?.organization_id);
        const industry = this.result.industries.filter((x: any) => x.id === company?.industry_id);
        const team_size = this.options.team_size.filter((x: any) => x.value === company?.team_size);
        this.logo.preview = company?.logo ? this.imgurl + company.logo : 'assets/images/no-picture.png';
        this.banner.preview = company?.banner ? this.imgurl + company.banner : 'assets/images/no-picture.png';
        this.Form.patchValue({
          company_name: company?.company_name,
          name: company?.user?.name || '',
          email: company?.user?.email || '',
          location: company?.location || '',
          company_phone: company?.company_phone || '',
          company_email: company?.company_email || '',
          website: company?.website || '',
          organization_id: organization,
          industry_id: industry,
          team_size: team_size,
          establishment_date: company?.establishment_date || '',
          bio: company?.bio || '',
          vision: company?.vision || ''
        });
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async dosubmit() {
    const $d = this.Form.get('establishment_date')?.value;
    const data = {
      id: this.id,
      'company_name': this.Form.get('company_name')?.value ? this.Form.get('company_name').value : '',
      'name': this.Form.get('name')?.value ? this.Form.get('name').value : '',
      'email': this.Form.get('email')?.value ? this.Form.get('email').value : '',
      'password': this.Form.get('password')?.value ? this.Form.get('password').value : '',
      'logo': this.Form.get('logo')?.value ? this.Form.get('logo').value : '',
      'banner': this.Form.get('banner')?.value ? this.Form.get('banner').value : '',
      'location': this.Form.get('location')?.value ? this.Form.get('location').value : '',
      'company_phone': this.Form.get('company_phone')?.value ? this.Form.get('company_phone').value : '',
      'company_email': this.Form.get('company_email')?.value ? this.Form.get('company_email').value : '',
      'website': this.Form.get('website')?.value ? this.Form.get('website').value : '',
      'organization_id': this.Form.get('organization_id')?.value?.length ? this.Form.get('organization_id').value[0].id : '',
      'industry_id': this.Form.get('industry_id')?.value?.length ? this.Form.get('industry_id').value[0].id : '',
      'team_size': this.Form.get('team_size')?.value?.length ? this.Form.get('team_size').value[0].value : '',
      'establishment_date': $d.startDate ? moment($d.startDate.$d).format('YYYY-MM-DD') : $d,
      'bio': this.Form.get('bio')?.value ? this.Form.get('bio').value : '',
      'vision': this.Form.get('vision')?.value ? this.Form.get('vision').value : '',
    };
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'companies', true, true);
      if (res?.status == true) {
        this.router.navigate(['/companies']);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  public onLogoChange($ev: any) {
    const reader = new FileReader();
    if ($ev.target.files && $ev.target.files.length) {
      const [file] = $ev.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logo.preview = reader.result as string;
        this.Form.get('logo').value = $ev.target.files[0];
        this.logo.delete = true;
        this.logo.browse = false;
      };
    }
  }

  cancelLogo() {
    this.logo.preview = 'assets/images/no-picture.png';
    this.Form.get('logo').value = '';
    this.logo.delete = false;
    this.logo.browse = true;
  }

  public onBannerChange($ev: any) {
    const reader = new FileReader();
    if ($ev.target.files && $ev.target.files.length) {
      const [file] = $ev.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.banner.preview = reader.result as string;
        this.Form.get('banner').value = $ev.target.files[0];
        this.banner.delete = true;
        this.banner.browse = false;
      };
    }
  }

  cancelBanner() {
    this.banner.preview = 'assets/images/no-picture.png';
    this.Form.get('banner').value = '';
    this.banner.delete = false;
    this.banner.browse = true;
  }

}
