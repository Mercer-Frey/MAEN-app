import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { User } from '../interfaces'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = null
  constructor(private http: HttpClient) {}

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user).pipe(
      tap(({ token }) => {
        localStorage.setItem('auth-token', token)
        this.setToken(token)
      })
    )
  }
  signUp(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/signup', user)
  }
  setToken(token) {
    this.token = token
  }
  getToken(): string {
    return this.token
  }
  isAuthenticated(): boolean {
    return !!this.token
  }
  logOut() {
    this.setToken(null)
    localStorage.clear()
  }
}
