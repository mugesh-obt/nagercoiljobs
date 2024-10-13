import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

const site_url = environment.apiUrl;
const api_url = `${site_url}api/`;

const TOKEN_KEY = 'pm_token';
const REFRESHTOKEN_KEY = 'pm_refreshtoken';
const ID = 'pm_id';
const ROLE = 'pm_role';
const USER = 'pm_user';

interface TokenPayload {
  exp: number;
  username: string;
  id: number;
  role: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const posthttpOptions = {
  headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public network: boolean = navigator.onLine;
  public network_msg: string = 'Network not available.';
  public urls: { [key: string]: string } = {};
  private popMsg = new BehaviorSubject<any>({});
  public popMsg$ = this.popMsg.asObservable();
  public res: any = {};
  public user_details: any = {};
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private httpClient: HttpClient,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.init();
  }

  private init() {
    this.urls = {
      me: `${api_url}me/`,
      login: `${api_url}login`,
      logout: `${api_url}logout`,
      register: `${api_url}register`,
      forgot_password: `${api_url}forgot-password`,
      reset_password: `${api_url}reset-password`,
      dashboard: `${api_url}dashboard-data/`,
      orders: `${api_url}orders/`,
      companies: `${api_url}companies/`,
      modify_company_status: `${api_url}companies/update-status/`,
      modify_company_verification: `${api_url}companies/verify-user/`,
      candidates: `${api_url}candidates/`,
      modify_candidate_status: `${api_url}candidates/update-status/`,
      modify_candidate_verification: `${api_url}candidates/verify-user/`,
      jobs: `${api_url}jobs/`,
      modify_job_status: `${api_url}jobs/update-status/`,
      multi_jobs_delete: `${api_url}jobs/multi-delete/`,

      plans: `${api_url}plans/`,
      organizations: `${api_url}organizations/`,
      industries: `${api_url}industries/`,
      job_categories: `${api_url}job-categories/`,
      job_roles: `${api_url}job-roles/`,
      job_types: `${api_url}job-types/`,
      professions: `${api_url}professions/`,
      skills: `${api_url}skills/`,
      educations: `${api_url}educations/`,
    };
  }

  private api_key(key: string): string {
    return this.urls[key] || '';
  }

  public async api_actions(
    method: string,
    data: any,
    key: string,
    loader: boolean = false,
    msg: boolean = false
  ): Promise<any> {
    if (!navigator.onLine) {
      this.popupOpen('warning', this.network_msg);
      return;
    }

    if (loader) this.loader(true);

    let http$: any;
    switch (method) {
      case 'post':
        let formData = new FormData();
        if (data instanceof Object && !(data instanceof FormData)) {
          for (let key in data) {
            formData.append(key, data[key]);
          }
        } else {
          formData = data;
        }
        if (data.id) {
          http$ = this.httpClient.post(`${this.api_key(key)}${data.id}`, formData, posthttpOptions);
        } else {
          http$ = this.httpClient.post(this.api_key(key), formData, posthttpOptions);
        }
        break;
      case 'put':
        http$ = this.httpClient.put(`${this.api_key(key)}${data.id}`, data, httpOptions);
        break;
      case 'patch':
        http$ = this.httpClient.patch(`${this.api_key(key)}${data.id}`, data, httpOptions);
        break;
      case 'get':
        if (data.id) {
          http$ = this.httpClient.get(`${this.api_key(key)}${data.id}`, httpOptions);
        } else {
          const queryString = typeof data === 'string' ? data : this.buildQueryParams(data);
          http$ = this.httpClient.get(`${this.api_key(key)}${queryString}`, httpOptions);
        }
        break;
      case 'delete':
        http$ = this.httpClient.delete(`${this.api_key(key)}${data.id}`, httpOptions);
        break;
      default:
        return;
    }

    return new Promise((resolve) => {
      http$.subscribe(
        (res: any) => {
          if (loader) this.loader(false);
          if (res?.status) {
            if (msg) {
              this.popupOpen('success', res.message);
            }
          } else {
            if (msg && res.code) {
              this.popupOpen('error', res.message || 'An error occurred');
            }
          }
          resolve(res);
        },
        (err: HttpErrorResponse) => {
          if (loader) this.loader(false);
          this.popupOpen('warning', err.error.error || 'Something went wrong');
          resolve(err);
        }
      );
    });
  }

  private buildQueryParams(data: object): string {
    return '?' + Object.entries(data).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
  }

  public loader(status: boolean) {
    const loaderElement = document.getElementById('loader');
    if (loaderElement) {
      loaderElement.style.display = status ? 'block' : 'none';
    }
  }

  public async popupOpen(type: 'success' | 'error' | 'warning', message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: type,
      customClass: { popup: 'colored-toast' },
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    let icon: any;
    let title: string;

    switch (type) {
      case 'success':
        icon = 'success';
        title = 'Success';
        break;
      case 'error':
        icon = 'error';
        title = 'Error';
        break;
      case 'warning':
        icon = 'warning';
        title = 'Warning';
        break;
    }

    await Toast.fire({
      icon,
      title,
      text: message,
      showCloseButton: true,
    });
  }

  public addItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public getID(): string | null {
    return this.getItem(ID);
  }

  public getToken(): string | null {
    return this.getItem(TOKEN_KEY);
  }

  public getRole(): string {
    return this.getItem(ROLE) || '';
  }

  public getUserData(): string {
    return this.getItem(USER) || '';
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(`${newTitle} | Project Management`);
  }

  public saveToken(token: string, user: any) {
    localStorage.clear();
    this.addItem(TOKEN_KEY, token);

    if (user) {
      this.addItem(ID, user.id.toString());
      this.addItem(ROLE, user.role);
    }
  }

  public getUser(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : {};
  }

  public decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  public refreshToken(token: string) {
    return this.httpClient.post(`${api_url}refresh`, { refreshToken: token }, httpOptions);
  }

  public saveRefreshToken(token: string) {
    this.removeItem(REFRESHTOKEN_KEY);
    this.addItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return this.getItem(REFRESHTOKEN_KEY);
  }

  public logout() {
    this.removeItem(ID);
    this.removeItem(TOKEN_KEY);
    this.removeItem(ROLE);
    this.removeItem(USER);
  }
}
