import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/* Services */
import { BackendService } from '../../services/backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    public api: BackendService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const token = this.api.getToken();
    if (token && token !== 'undefined') {
      const role = this.api.getRole();
      // If already on login page, redirect to dashboard
      if (state.url === '/login' || state.url === '/') {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        if (route.data['roles'].includes(role)) {
          return true;
        } else {
          this.router.navigate(['/**']);
          return false;
        }
      }
      // Allow access to other routes
      return true;
    } else {
      localStorage.clear();
      // If not authenticated, redirect to login
      if (state.url !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
      // Allow access to the login page
      return true;
    }
  }

}
