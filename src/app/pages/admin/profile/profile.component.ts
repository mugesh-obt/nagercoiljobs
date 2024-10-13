import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

import { SidebarComponent } from '../../common/sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public err: any = {};
  public res: any = {};
  public form: any = {};
  public data: any = {};
  public user: any = {};
  user_data_int: any = false;
  imageUrl: any;
  public fileToUpload: any = '';
  public profile_image: any = '';

  constructor(private router: Router, public fb: FormBuilder, public api: BackendService) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
      profile: [''],
    });
    // let user = this.api.getUserData();
    //this.user = JSON.parse(user);   
  }

  ngOnInit() {
    this.api.setTitle('Profile');
    this.doView();

  }


  public async doView() {
    try {
      this.res = await this.api.api_actions('get', '', 'admin', true, false);
      if (this.res.status == true) {
        this.user_data_int = true;
        this.data = this.res.data;
        //this.api.addItem('pm', JSON.stringify(this.data));
        //let user = this.api.getUserData();
        this.user = this.data;

        this.form.patchValue({ name: [this.data.name] });
        this.form.patchValue({ email: [this.data.email] });
        // this.form.patchValue({ phone: [this.data.phone] });
        // this.form.patchValue({ profile_image: [this.data.image_url] });
        this.err = {};
      } else {
        this.err = this.res.errors ? this.res.errors : {};
      }
    } catch (err: any) {

    }

  }

  handleFileInput(file: FileList) {
    if (file[0].type != 'image/png' && file[0].type != 'image/jpg' && file[0].type != 'image/jpeg') {
      this.api.popupOpen('warning', 'You are trying to upload a wrong format.');
      return;
    }
    if (file[0].size > 10000000) {
      this.api.popupOpen('warning', 'The image size should be less than 10MB.');
      return;
    }
    if (file.length > 0) {
      const image = file[0];
      this.fileToUpload = file.item(0);

      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.profile_image = reader.result;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }


  removeImage(flag: any) {
    if (flag == 1) {
      this.imageUrl = '';
    } else if (flag == 2) {
      this.data.image_url = '';
      this.user.profile_image = '';
      this.api.addItem('audbk_user', JSON.stringify(this.user));
      this.fileToUpload = 'remove';
    }

  }

  public async doAction() {
    try {
      var formData: any = new FormData();
      formData.append("email", this.form.value.email ? this.form.value.email : '');
      formData.append("name", this.form.value.name ? this.form.value.name : '');
      formData.append("password", this.form.value.password ? this.form.value.password : '');
      formData.append("password_confirmation", this.form.value.password_confirmation ? this.form.value.password_confirmation : '');
      // formData.append("phone", this.form.value.phone ? this.form.value.phone : '');
      formData.append('profile', this.fileToUpload != undefined ? this.fileToUpload : '');
      this.res = await this.api.api_actions('post', formData, 'admin', true, true);
      if (this.res.status == true) {
        //  console.log('gjghj')
        /*setTimeout( (e: any)=>{
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/profile/basic-details']);
          });
        }, 2000); */
        this.doView();

        this.err = {};
      } else {
        if (this.res.code == 200) {
          this.err = this.res.errors ? this.res.errors : {};
        }
      }
    }
    catch (err: any) {
      this.api.popupOpen('warning', err.error.error || 'Something went wrong');
    }
  }

}
