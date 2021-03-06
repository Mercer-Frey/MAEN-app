import { Category } from './../../shared/interfaces'
import { CategoriesService } from './../../shared/services/categories.service'
import { of, Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { switchMap } from 'rxjs/operators'
import { MaterialService } from 'src/app/shared/classes/material.service'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  @ViewChild('file') fileRef: ElementRef
  paramsSub: Subscription
  categorySub: Subscription
  deleteSub: Subscription

  image: File
  imagePreview: ArrayBuffer | string
  form: FormGroup
  isNew = true
  category: Category

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoriesS: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    })
    this.form.disable()
    this.paramsSub = this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false
            return this.categoriesS.getById(params['id'])
          }
          return of(null)
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category
            this.imagePreview = category.imageSrc
            this.form.patchValue({
              name: category.name,
            })
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        (error) => MaterialService.toast(error.message)
      )
  }
  ngOnDestroy(): void {
    this.paramsSub.unsubscribe()
    if (this.categorySub) this.categorySub.unsubscribe()
    if (this.deleteSub) this.deleteSub.unsubscribe()
  }
  triggerClick() {
    console.log(this.fileRef)

    this.fileRef.nativeElement.click()
  }
  onFileUpload(event: any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    this.image = file
    reader.readAsDataURL(file)

    reader.onload = () => {
      console.log(reader)

      this.imagePreview = reader.result
    }
  }
  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
      obs$ = this.categoriesS.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesS.update(this.category._id, this.form.value.name, this.image)
    }

    this.categorySub = obs$.subscribe(
      (category: Category) => {
        this.category = category
        if (this.isNew) {
          MaterialService.toast('Category was created')
          this.router.navigate(['/categories'])
        } else {
          MaterialService.toast('Changes were saved')
          this.form.enable()
        }
      },
      (error: HttpErrorResponse) => {
        MaterialService.toast(error.message)
        this.form.enable()
      }
    )
  }
  deleteCategory() {
    const decision = window.confirm(`Do you want to delete "${this.category.name}"`)
    if (decision) {
      this.deleteSub = this.categoriesS.delete(this.category._id).subscribe(
        (response) => {
          MaterialService.toast(response.message)
        },
        (error: HttpErrorResponse) => MaterialService.toast(error.message),
        () => this.router.navigate(['/categories'])
      )
    }
  }
  get name(): FormControl {
    return this.form.get('name') as FormControl
  }
}
