import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {

  public res: any = {};
  public result: any;

  constructor(
    private router: Router,
    public api: BackendService) { }

  ngOnInit(): void {
    this.get_me();
  }

  public async get_me() {
    try {
      const res = await this.api.api_actions('get', '', 'me', true, false);
      if (res?.status) {
        this.result.orders = res?.res;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public async doLogout() {
    try {
      const res = await this.api.api_actions('post', '', 'logout', true, true);
      if (res?.status) {
        this.api.logout();
        this.router.navigate(['/']);
      } else {
        //
      }
    } catch (error) {
      console.error('Loout Error:', error);
    }
  }
}


