import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { AnalyticsPage } from '../shared/interfaces'
import { Chart } from 'chart.js'
import { AnalyticsService } from '../shared/services/analytics.service'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  analyticsSub: Subscription
  average: number
  pending = true

  constructor(private analyticsS: AnalyticsService) {}

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255,99,132)',
    }
    const orderConfig: any = {
      label: 'order',
      color: 'rgb(54,152,235)',
    }
    this.analyticsSub = this.analyticsS.getAnalytics().subscribe((data: AnalyticsPage) => {
      gainConfig.labels = data.chart.map((item) => item.label)
      gainConfig.data = data.chart.map((item) => item.gain)
      orderConfig.labels = data.chart.map((item) => item.label)
      orderConfig.data = data.chart.map((item) => item.order)
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'
      new Chart(gainCtx, createChartCofig(gainConfig))
      new Chart(orderCtx, createChartCofig(orderConfig))

      this.average = data.average
      this.pending = false
    })
  }
  ngOnDestroy(): void {
    if (this.analyticsSub) this.analyticsSub.unsubscribe()
  }
}

function createChartCofig({ labels, label, data, color }) {
  return {
    type: 'line',
    options: { responsive: true },
    data: {
      labels,
      datasets: [{ label, data, borderColor: color, steppedLine: false, fill: false }],
    },
  }
}
