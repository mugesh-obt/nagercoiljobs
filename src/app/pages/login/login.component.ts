import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';

/* Services */
import { BackendService } from '../../services/backend/backend.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public form: any = {};
  public err: any = {};

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public api: BackendService) {

    this.api.setTitle('Login');
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  public async doLogin() {
    const data = this.form.value;
    this.err = {};
    try {
      const res = await this.api.api_actions('post', data, 'login', true, true);
      if (res?.status == true) {
        this.api.saveToken(res.token, res.user);
        this.router.navigate(['/dashboard']);
      } else {
        this.err = res.error.errors ?? {};
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }
}
