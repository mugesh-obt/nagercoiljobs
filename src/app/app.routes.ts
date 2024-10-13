import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Services */
import { AuthService as AuthGuard } from './services/auth/auth.service';

/* Pages */
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent as AdmindashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ProfileComponent } from './pages/admin/profile/profile.component';

import { OrdersComponent } from './pages/admin/orders/orders.component';
import { CreateOrderComponent } from './pages/admin/orders/create-order/create-order.component';
import { OrderDetailsComponent } from './pages/admin/orders/order-details/order-details.component';
import { CompanyComponent } from './pages/admin/company/company.component';
import { CompanyAddComponent } from './pages/admin/company/company-add/company-add.component';
import { CompanyEditComponent } from './pages/admin/company/company-edit/company-edit.component';
import { CompanyViewComponent } from './pages/admin/company/company-view/company-view.component';
import { CandidateComponent } from './pages/admin/candidate/candidate.component';
import { CandidateAddComponent } from './pages/admin/candidate/candidate-add/candidate-add.component';
import { CandidateEditComponent } from './pages/admin/candidate/candidate-edit/candidate-edit.component';
import { CandidateViewComponent } from './pages/admin/candidate/candidate-view/candidate-view.component';
import { JobsComponent } from './pages/admin/jobs/jobs.component';
import { JobAddComponent } from './pages/admin/jobs/job-add/job-add.component';
import { JobEditComponent } from './pages/admin/jobs/job-edit/job-edit.component';
import { JobViewComponent } from './pages/admin/jobs/job-view/job-view.component';

import { SampleTemplateComponent } from './pages/sample-template/sample-template.component'

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [AuthGuard], },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard], },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'dashboard', component: AdmindashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'order/create', component: CreateOrderComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'order/view/:id', component: OrderDetailsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'companies', component: CompanyComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'company/create', component: CompanyAddComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'company/edit/:id', component: CompanyEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'company/view/:id', component: CompanyViewComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'candidates', component: CandidateComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'candidate/create', component: CandidateAddComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'candidate/edit/:id', component: CandidateEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'candidate/view/:id', component: CandidateViewComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'job/create', component: JobAddComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'job/edit/:id', component: JobEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'job/view/:id', component: JobViewComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

    { path: 'sample', component: SampleTemplateComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
