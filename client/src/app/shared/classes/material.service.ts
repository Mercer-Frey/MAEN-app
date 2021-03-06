import { ElementRef, Injectable } from '@angular/core'

declare var M

export interface MaterialModalInstance {
  open?(): void
  close?(): void
  destroy?(): void
}
export interface MaterialDatepicker extends MaterialModalInstance {
  date?: Date
}

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  static toast(html: string): void {
    M.toast({ html })
  }
  static initializeFloatingButton(ref: ElementRef): void {
    M.FloatingActionButton.init(ref.nativeElement)
  }
  static updateTextInputs(): void {
    M.updateTextFields()
  }
  static initModal(ref: ElementRef): MaterialModalInstance {
    return M.Modal.init(ref.nativeElement)
  }
  static initTooltip(ref: ElementRef): MaterialModalInstance {
    return M.Tooltip.init(ref.nativeElement)
  }
  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      autoClose: true,
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose,
    })
  }
  static initTapTarget(ref: ElementRef): MaterialModalInstance {
    return M.TapTarget.init(ref.nativeElement)
  }
}
