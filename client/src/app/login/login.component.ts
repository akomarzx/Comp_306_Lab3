import { Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSecurityService } from '../services/user-security.service';
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
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm : FormGroup;
  registrationForm : FormGroup;
  message : WritableSignal<String>;
  currentTabIndex : number

  constructor(private formBuilder : FormBuilder, 
    private userSecService : UserSecurityService, 
    private router : Router){

    this.message = signal('')
    this.currentTabIndex = 0

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]
      ]
    });

    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]
      ]
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onLoginSubmit() {
    let username = this.loginForm.get('username')?.value
    let password = this.loginForm.get('password')?.value

    this.userSecService.authenticateUser(username, password).subscribe({
      next: (result) => {
          this.userSecService.storeUser(username)
          this.router.navigate(['home'])
      },
      error: (error) => {
        this.message.set(error.error)
      }
    })
   
  }

  onRegistrationSubmit() {
    this.userSecService.registerUser(this.registrationForm.controls['username'].value, this.registrationForm.controls['password'].value).subscribe({
      next: (result) => {
        this.message.set("Registration Successful")
        this.currentTabIndex = 0
        this.loginForm.patchValue(this.registrationForm.getRawValue())
      },
      error: (error) => {
        this.message.set(`Registration Failed - ${error?.description}`)
      }
    })
  }

  onTabchange() {
    this.loginForm.reset();
    this.loginForm.markAsUntouched()
    this.registrationForm.reset();
    this.registrationForm.markAsUntouched()
    this.message.set('');
  }
}
