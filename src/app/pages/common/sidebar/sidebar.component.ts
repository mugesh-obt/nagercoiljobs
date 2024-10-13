import { Component, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  dashboard_link: any;
  profile_link: any;
  @Input() title: any; // Define an input property

  constructor(
    public api: BackendService,
    private router: Router) {
    this.checkDashboardLink();
  }

  profile: boolean = false;
  clickEvent() {
    this.profile = !this.profile;
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

  checkDashboardLink() {
    if (this.api.getRole() == 'admin') {
      this.dashboard_link = '/admin/dashboard';
      this.profile_link = '/admin/profile';
    }
  }
}
