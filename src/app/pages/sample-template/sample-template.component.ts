import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TopbarComponent } from './../common/topbar/topbar.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';

@Component({
  selector: 'app-sample-template',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    NgxPaginationModule,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './sample-template.component.html',
  styleUrl: './sample-template.component.scss'
})
export class SampleTemplateComponent {

  p: number = 1;
  collection: any[] = [];
}
