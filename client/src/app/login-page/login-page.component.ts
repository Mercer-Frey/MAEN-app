import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialService } from '../shared/classes/material.service'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginSub: Subscription
  querySub: Subscription
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
    this.querySub = this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Try login')
      } else if (params['accessDenied']) {
        MaterialService.toast('Access denied')
      } else if (params['sessionExpired']) {
        MaterialService.toast('Session expired')
      }
    })
  }
  onSubmit(): void {
    this.form.disable()
    this.loginSub = this.authS.login(this.form.value).subscribe(
      (token) => {
        this.router.navigate(['/overview'])
      },
      (error) => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
  ngOnDestroy(): void {
    if (this.loginSub) this.loginSub.unsubscribe()
    this.querySub.unsubscribe()
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl
  }
}
