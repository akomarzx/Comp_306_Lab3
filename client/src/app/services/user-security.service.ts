import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  currentUser : BehaviorSubject<User|null>
  
  constructor() {
    this.currentUser = new BehaviorSubject<User|null>(null)
  }

  authenticateUser(username : string, password : string) : boolean{
    let usernameTest = "ronald"
    let passwordTest = "123456789"
    let userId = 1
    let isValid = username === usernameTest && password === passwordTest
    
    if(isValid) {
      this.currentUser.next(new User(userId, username));
    }

    return isValid   
  }

  isAuthenticated() : Boolean {
    return this.currentUser.value != null
  }

}
