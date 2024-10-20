import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSecurityService } from '../services/user-security.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm : FormGroup;
  registrationForm : FormGroup;
  message : BehaviorSubject<string>;


  constructor(private formBuilder : FormBuilder, 
    private userSecService : UserSecurityService, 
    private router : Router){

    this.message = new BehaviorSubject<string>('')

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onLoginSubmit() {
    let username = this.loginForm.get('username')?.value
    let password = this.loginForm.get('password')?.value

    if(this.userSecService.authenticateUser(username, password)) {
      this.router.navigate(['home'])
    } else {
      this.message.next('Incorrect Credentials');
    }
    
  }

  onRegistrationSubmit() {
    console.log(this.registrationForm.getRawValue());
  }
}
