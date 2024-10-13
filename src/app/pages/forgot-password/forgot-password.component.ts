import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';

/* Services */
import { BackendService } from '../../services/backend/backend.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: '../login/login.component.scss'
})
export class ForgotPasswordComponent {
  public res: any = {};
  public form: any = {};
  public err: any = {};

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public api: BackendService) {
    this.api.setTitle('Forgot Password');
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
    });
  }

  public async doSend() {
    const data = this.form.value;
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'forgot_password', true, true);
      if (res?.status == true) {
        setTimeout((e: any) => {
          this.router.navigateByUrl('/');
        }, 2000);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
    }
  }
}