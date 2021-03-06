import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialService } from '../shared/classes/material.service'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  signUpSub: Subscription
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  onSubmit(): void {
    this.form.disable()
    this.signUpSub = this.authS.signUp(this.form.value).subscribe(
      (user) => {
        this.router.navigate(['/login'], {
          queryParams: { registered: true },
        })
      },
      (error) => {
        MaterialService.toast(error.error.message)
      }
    )
  }
  ngOnDestroy(): void {
    if (this.signUpSub) {
      this.signUpSub.unsubscribe()
    }
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl
  }
}
