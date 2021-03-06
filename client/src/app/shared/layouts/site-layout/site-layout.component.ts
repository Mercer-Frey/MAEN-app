import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { MaterialService } from '../../classes/material.service'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floatingButton') floatingRef: ElementRef
  links = [
    { url: '/overview', name: 'Overview' },
    { url: '/analytics', name: 'Analytics' },
    { url: '/history', name: 'History' },
    { url: '/order', name: 'Order' },
    { url: '/categories', name: 'Categories' },
  ]

  constructor(private router: Router, private authS: AuthService) {}

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }
  logOut(event: Event): void {
    event.preventDefault()
    this.authS.logOut()
    this.router.navigate(['./login'])
  }
}
