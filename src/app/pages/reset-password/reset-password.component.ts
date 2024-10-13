import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';

/* Services */
import { BackendService } from '../../services/backend/backend.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  public res: any = {};
  public form: any = {};
  public err: any = {};
  email_code: any;
  token: any;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public api: BackendService,
    private activeRouter: ActivatedRoute) {
    this.api.setTitle('Reset Password');

    this.activeRouter.queryParams.subscribe((params: any) => {
      let email = params['email'];
      let token = params['token'];
      this.email_code = email;
      this.token = token;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      token: [this.token],
      email: [this.email_code],
      password: [''],
      password_confirmation: [''],
    });
  }

  public async doReset() {
    const data = this.form.value;
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'reset_password', true, true);
      if (res?.status == true) {
        setTimeout((e: any) => {
          this.router.navigateByUrl('/');
        }, 2000);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
    }
  }

}
