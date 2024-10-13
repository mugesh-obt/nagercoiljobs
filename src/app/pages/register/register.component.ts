import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';

/* Services */
import { BackendService } from '../../services/backend/backend.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public res: any = {};
  public form: any = {};
  public err: any = {};

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public api: BackendService) {

    this.form = this.fb.group({
      role: ['candidate'],
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
    });
  }

  ngOnInit() {
    this.api.setTitle('Register');

  }

  public async doSignup() {
    try {
      this.err = {};
      var input = this.form.value;
      this.res = await this.api.api_actions('post', input, 'register', true, true);
      if (this.res.status == true) {
        this.api.addItem('pm_id', this.res.user.id);
        this.api.addItem('pm_token', this.res.authorisation.token);
        this.api.addItem('pm_role', this.res.user.role);
        if (this.res.user.role == 'candidate') {
          setTimeout((e: any) => {
            this.router.navigateByUrl('/candidate/dashboard');
          }, 2000);
        } else if (this.res.user.role == 'company') {
          setTimeout((e: any) => {
            this.router.navigateByUrl('/company/dashboard');
          }, 2000);
        }
        this.err = {};
      } else {
        if (this.res.code == 200) {
          this.err = this.res.errors ? this.res.errors : {};
        }
      }
    }
    catch (err: any) {
      console.log(err);
      this.api.popupOpen('warning', err.error.error || 'Something went wrong');
    }
  }

}
