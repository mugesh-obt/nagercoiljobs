import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TopbarComponent } from '../../../common/topbar/topbar.component';
import { SidebarComponent } from '../../../common/sidebar/sidebar.component';

/* Services */
import { BackendService } from '../../../../services/backend/backend.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {

  id: any;
  result: any = {
    orders: []
  };

  constructor(
    public api: BackendService,
    private activeRouter: ActivatedRoute) {

    this.id = this.activeRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.view_order();
  }

  public async view_order() {
    let data = { 'id': this.id }
    try {
      const res = await this.api.api_actions('get', data, 'orders', true, false);
      if (res?.status == true) {
        this.result.orders = res?.data;
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

}
