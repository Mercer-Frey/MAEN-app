import { Filter } from './../shared/interfaces'
import { Subscription } from 'rxjs'
import { MaterialModalInstance, MaterialService } from 'src/app/shared/classes/material.service'
import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { OrdersService } from '../shared/services/orders.service'
import { Order } from '../shared/interfaces'

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialModalInstance
  ordersSub: Subscription
  isFilterVisible = false
  orders: Order[] = []
  filter: Filter = {}
  loading = false
  reloading = false
  noMore = false

  offset = 0
  limit = STEP

  constructor(private ordersS: OrdersService) {}

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }
  ngOnDestroy(): void {
    if (this.ordersSub) this.ordersSub.unsubscribe()
    if (this.tooltip) this.tooltip.destroy()
  }
  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    })
    this.ordersSub = this.ordersS.fetch(params).subscribe(
      (orders) => {
        this.orders = this.orders.concat(orders)
        this.noMore = orders.length < STEP || orders.some((o) => o.order === 1)
      },
      (error) => {},
      () => {
        this.loading = false
        this.reloading = false
      }
    )
  }
  loadMore(): void {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }
  applyFilter(filter: Filter): void {
    this.orders = []
    this.offset = 0
    this.reloading = true
    this.filter = filter
    this.fetch()
  }
  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }
  onFilter() {
    if (this.isFiltered()) {
      this.applyFilter({})
    }
    this.isFilterVisible = !this.isFilterVisible
  }
}
