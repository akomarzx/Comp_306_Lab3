import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  private user : BehaviorSubject<User|null>
  
  get currentUser() : User | null {
    return this.user.getValue()
  }

  constructor() {
    this.user = new BehaviorSubject<User|null>(null)
  }

  authenticateUser(username : string, password : string) : boolean{
    let usernameTest = "r"
    let passwordTest = "1"
    let userId = 1
    let isValid = username === usernameTest && password === passwordTest
    
    if(isValid) {
      this.user.next(new User(userId, username));
    }

    return isValid   
  }

  isAuthenticated() : Boolean {
    return this.user.getValue() != null
  }

}
