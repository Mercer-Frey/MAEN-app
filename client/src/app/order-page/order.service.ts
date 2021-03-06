import { OrderPosition } from './../shared/interfaces'
import { Position } from 'src/app/shared/interfaces'
import { Injectable } from '@angular/core'

@Injectable()
export class OrderService {
  public list: OrderPosition[] = []
  public price = 0

  add(position: Position): void {
    const orderPosition: OrderPosition = Object.assign(
      {},
      {
        name: position.name,
        cost: position.cost,
        quantity: position.quantity,
        _id: position._id,
      }
    )
    const candidate = this.list.find((p) => p._id === orderPosition._id)
    if (candidate) {
      candidate.quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }
    this.computePrice()
  }

  remove(orderPosition: OrderPosition): void {
    const i = this.list.findIndex((p) => p._id === orderPosition._id)
    this.list.splice(i, 1)
    this.computePrice()
  }

  clear(): void {
    this.list = []
    this.price = 0
  }
  private computePrice(): void {
    this.price = this.list.reduce((total, item) => {
      total += item.quantity * item.cost
      return total
    }, 0)
  }
}
