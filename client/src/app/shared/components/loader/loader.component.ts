import { Component } from '@angular/core'

@Component({
  selector: 'app-loader',
  template: `
    <div class="row">
      <div class="col s12 center">
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </div>
    </div>
  `,
})
export class LoaderComponent {}
