import { MaterialModalInstance, MaterialService } from 'src/app/shared/classes/material.service'
import { OverviewPage } from './../shared/interfaces'
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { Observable } from 'rxjs'
import { AnalyticsService } from '../shared/services/analytics.service'

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef: ElementRef
  data$: Observable<OverviewPage>
  tapTarget: MaterialModalInstance
  yesterday = new Date()

  constructor(private analyticsS: AnalyticsService) {}

  ngOnInit(): void {
    this.data$ = this.analyticsS.getOverview()
    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }
  ngOnDestroy(): void {
    if (this.tapTarget) this.tapTarget.destroy()
  }
  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }
  openInfo(): void {
    this.tapTarget.open()
  }
}
