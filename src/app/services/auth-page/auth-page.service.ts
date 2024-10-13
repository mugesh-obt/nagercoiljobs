import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

/* Services */
import { BackendService } from '../../services/backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPageService {
  private userExistsCache = new BehaviorSubject<any | null>(null);

  constructor(private router: Router, public api: BackendService, private route: ActivatedRoute, private Location: Location) {
  }

  async canActivate(route: ActivatedRouteSnapshot,): Promise<boolean> {
    if (this.api.getToken()) {
      const cachedUserExists = this.userExistsCache.getValue();

      if (cachedUserExists === null) {
        const userExists = await this.api.canActiveUser().toPromise();
        // this.userExistsCache.next(userExists);
        return true;
        if (userExists) {
          //   const role = this.api.getRole();
          //   if (role && route.data['roles'].includes(role)) { console.log(userExists)
          //     if (role === 'admin') { console.log('userExists')
          //       this.router.navigateByUrl('/admin/dashboard', { replaceUrl:true });  
          //   }
          //   return true;
          // }else{
          //   /*if(this.api.getRole() == 'user'){
          //     this.router.navigateByUrl('/project', { replaceUrl:true });  
          //   }else{
          //     this.router.navigateByUrl('/dashboard', { replaceUrl:true });  
          //   } */
          //   this.router.navigateByUrl('/admin/dashboard', { replaceUrl:true });             
          //   return false;
          // }   
          return this.checkRoleAndNavigate(route);
        } else {
          this.api.logout();
          this.router.navigateByUrl('/', { replaceUrl: true });
          return false;
        }
      } else {
        return this.checkRoleAndNavigate(route);
      }
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
      return false;
    }
  }

  private checkRoleAndNavigate(route: ActivatedRouteSnapshot): boolean {
    const role = this.api.getRole();
    if (role && route.data['roles'].includes(role)) {
      if (role === 'admin') {
        this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
        return false;
      }
      return true;
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
      return false;
    }
  }

}
