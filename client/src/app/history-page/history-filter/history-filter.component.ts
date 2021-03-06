import { MaterialDatepicker } from './../../shared/classes/material.service'
import { MaterialService } from 'src/app/shared/classes/material.service'
import { Filter } from './../../shared/interfaces'
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core'

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  start: MaterialDatepicker
  end: MaterialDatepicker
  order: number

  isValid = true

  ngOnDestroy(): void {
    if (this.start) this.start.destroy()
    if (this.end) this.end.destroy()
  }
  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
  }
  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }
    this.isValid = this.start.date < this.end.date
  }
  submitFilter(): void {
    let filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }
    if (this.start.date) {
      filter.start = this.start.date
    }
    if (this.end.date) {
      filter.end = this.start.date
    }
    this.onFilter.emit(filter)
  }
}
