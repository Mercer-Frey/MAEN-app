import { Order, OrderPosition } from './../shared/interfaces'
import { MaterialModalInstance } from './../shared/classes/material.service'
import { Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { MaterialService } from '../shared/classes/material.service'
import { OrderService } from './order.service'
import { OrdersService } from '../shared/services/orders.service'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef

  routerSub: Subscription
  ordersSub: Subscription
  modal: MaterialModalInstance
  isRoot: boolean
  pending = false

  constructor(
    private router: Router,
    public orderS: OrderService,
    private ordersS: OrdersService
  ) {}

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }
  ngOnDestroy(): void {
    this.routerSub.unsubscribe()
    if (this.ordersSub) this.ordersSub.unsubscribe()
    if (this.modal) this.modal.destroy()
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }
  removePosition(orderPosition: OrderPosition): void {
    this.orderS.remove(orderPosition)
  }
  open(): void {
    this.modal.open()
  }
  cancel(): void {
    this.modal.close()
  }
  submit(): void {
    this.pending = true
    const order: Order = {
      list: this.orderS.list.map((item) => {
        delete item._id
        return item
      }),
    }
    this.ordersSub = this.ordersS.create(order).subscribe(
      (newOrder) => {
        MaterialService.toast(`Order №${newOrder.order} was added`)
        this.orderS.clear()
        this.modal.close()
      },
      (error: HttpErrorResponse) => {
        MaterialService.toast(error.message)
        this.pending = false
      },
      () => (this.pending = false)
    )
  }
}
