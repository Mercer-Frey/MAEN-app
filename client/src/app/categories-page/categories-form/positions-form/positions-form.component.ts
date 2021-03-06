import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModalInstance } from './../../../shared/classes/material.service'
import { Subscription } from 'rxjs'
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import { PositionsService } from 'src/app/shared/services/positions.service'
import { Position } from 'src/app/shared/interfaces'
import { MaterialService } from 'src/app/shared/classes/material.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() categoryId: string
  @ViewChild('modal') modalRef: ElementRef

  fetchSub: Subscription
  positionSub: Subscription
  deleteSub: Subscription
  modal: MaterialModalInstance
  positions: Position[] = []
  form: FormGroup
  positionId = null
  loading = false
  constructor(private positionsS: PositionsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      cost: [1, [Validators.required, Validators.min(1)]],
    })
    this.loading = true
    this.fetchSub = this.positionsS.fetch(this.categoryId).subscribe((positions) => {
      this.positions = positions
      this.loading = false
    })
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }
  ngOnDestroy(): void {
    this.fetchSub.unsubscribe()
    if (this.modal) this.modal.destroy()
    if (this.positionSub) this.positionSub.unsubscribe()
    if (this.deleteSub) this.deleteSub.unsubscribe()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    })
    MaterialService.updateTextInputs()
    this.modal.open()
  }
  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: '',
      cost: 1,
    })
    MaterialService.updateTextInputs()
    this.modal.open()
  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Do you want to delete position - ${position.name}`)
    if (decision) {
      this.positionsS.delete(position).subscribe(
        (response) => {
          const i = this.positions.findIndex((p) => p._id === position._id)
          this.positions.splice(i, 1)
          MaterialService.toast(response.message)
        },
        (error: HttpErrorResponse) => MaterialService.toast(error.message)
      )
    }
  }
  onCancelModal() {
    this.modal.close()
  }
  onSubmit() {
    const compleated = () => {
      this.form.enable()
      this.modal.close()
      this.form.reset({ cost: 1 })
    }
    const error = (e: HttpErrorResponse) => {
      MaterialService.toast(e.message)
      this.form.enable()
    }
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    }
    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionSub = this.positionsS.update(newPosition).subscribe(
        (position) => {
          const i = this.positions.findIndex((p) => p._id === position._id)
          this.positions[i] = position
          MaterialService.toast('Chandes were saved')
        },
        error,
        compleated
      )
    } else {
      this.positionSub = this.positionsS.create(newPosition).subscribe(
        (position) => {
          MaterialService.toast('Position was created')
          this.positions.push(position)
        },
        error,
        compleated
      )
    }
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl
  }
  get cost(): FormControl {
    return this.form.get('cost') as FormControl
  }
}
