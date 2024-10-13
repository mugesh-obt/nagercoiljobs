import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TopbarComponent } from '../../common/topbar/topbar.component';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import * as echarts from 'echarts';
import moment from 'moment';
import { environment } from '../../../../environments/environment.development';

/* Services */
import { BackendService } from '../../../services/backend/backend.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SharedModule,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  filter: boolean = false;
  model: any;
  result: any;
  imgurl: any;
  from_date = moment().subtract(7, 'months').startOf('month').format('YYYY-MM-DD');
  to_date = moment().endOf('month').format('YYYY-MM-DD');

  constructor(
    public api: BackendService) {
    this.api.setTitle('Dashboard');
  }

  ngOnInit(): void {
    this.imgurl = environment.imgUrl;
    this.get_dashboard_data();
  }

  clickEvent(): void {
    this.filter = !this.filter;
  }

  initCharts() {
    // Bar Chart
    const barChartDom = document.getElementById('barChart')!;
    const barChart = echarts.init(barChartDom);
    const barOption: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.result?.over_view?.earnings.map((x: any) => x.month),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.result.over_view?.earnings.map((x: any) => x.total)
        }
      ]
    };
    barChart.setOption(barOption);

    // Pie Chart
    const pieChartDom = document.getElementById('pieChart')!;
    const pieChart = echarts.init(pieChartDom);
    const pieOption: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.result.over_view?.popular_jobs
        }
      ]
    };
    pieChart.setOption(pieOption);
  }

  public async get_dashboard_data() {
    try {
      const data = { 'from_date': this.from_date, 'to_date': this.to_date }
      const res = await this.api.api_actions('get', data, 'dashboard', true, false);
      if (res?.status == true) {
        this.result = res?.res;
        this.initCharts();
      } else {
        //
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  }

  public created_time(time: any) {
    return moment(time).fromNow();
  }

  public display_profile(img: any) {
    return this.imgurl + img;
  }

}
