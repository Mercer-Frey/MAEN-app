import { MaterialService } from 'src/app/shared/classes/material.service'
import { OrderService } from './../order.service'
import { Position } from 'src/app/shared/interfaces'
import { Observable } from 'rxjs'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { PositionsService } from 'src/app/shared/services/positions.service'
import { map, switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss'],
})
export class OrderPositionsComponent implements OnInit {
  positionId: string
  positions$: Observable<Position[]>

  constructor(
    private route: ActivatedRoute,
    private positionS: PositionsService,
    private orderS: OrderService
  ) {}

  ngOnInit(): void {
    this.positions$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.positionS.fetch(params['id'])
      }),
      map((positions: Position[]) => {
        return positions.map((position) => {
          position.quantity = 1
          return position
        })
      })
    )
  }
  addToOrder(position: Position) {
    this.orderS.add(position)
    MaterialService.toast(`Added x${position.quantity}`)
  }
}
