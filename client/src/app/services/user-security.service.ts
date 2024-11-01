import { Injectable } from '@angular/core';
import { BehaviorSubject, exhaustMap, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  #apiUri = environment.apiUri

  private user : BehaviorSubject<User|null>
  
  get currentUser() : User | null {
    return this.user.getValue()
  }

  constructor(private http : HttpClient) {
    this.user = new BehaviorSubject<User|null>(null)
  }

  authenticateUser(username : string, password : string) : Observable<boolean> { 

    let credentials = {
      username: username,
      password: password
    }

    return of(credentials).pipe(
      exhaustMap((value) => {
        return this.http.post<boolean>(`${this.#apiUri}/auth/login`, credentials)
      })
    )
  }

  isAuthenticated() : Boolean {
    return this.user.getValue() != null
  }

  storeUser(username : string) {
    this.user = new BehaviorSubject<User | null>(new User(username))
  }

  registerUser(username: string, password: string) : Observable<boolean> {

    let credentials = {
      username: username,
      password: password
    }

    return of(credentials).pipe(
      exhaustMap((value) => {
        return this.http.post<boolean>(`${this.#apiUri}/auth/register`, credentials)
      })
    )

  }

}
