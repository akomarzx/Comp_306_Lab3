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

  isAuthenticated() : Boolean {
    return this.currentUser.value != null
  }

}
