import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { UserSecurityService } from './services/user-security.service';

export const routes: Routes = [
    {
        path: 'home', 
        component: HomeComponent,
        canActivate: [
            () => {
                const router = inject(Router)
                const userService = inject(UserSecurityService)
                if(userService.isAuthenticated()) {
                    return true
                } else {
                    router.navigate(['/login'])
                    return false
                }
            }
    ]},
    {path: 'login', component: LoginComponent}
];
