import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { UserSecurityService } from './services/user-security.service';
import { MovieListComponent } from './home/movie/movie-list/movie-list.component';
import { MovieInformationComponent } from './home/movie/movie-information/movie-information.component';

export const routes: Routes = [
    {
        path: 'home',
        title: 'MetFlex Home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [
            () => {
                const router = inject(Router)
                const userService = inject(UserSecurityService)
                if (userService.isAuthenticated()) {
                    return true
                } else {
                    router.navigate(['/login'])
                    return false
                }
            }
        ],
        children : [
            {
                path: 'movies', 
                loadComponent: () => import('./home/movie/movie-list/movie-list.component').then(m => m.MovieListComponent)
            },
            {
                path: 'movies/:id', 
                loadComponent: () => import('./home/movie/movie-information/movie-information.component').then(m => m.MovieInformationComponent)
            }
        ]
    },
    { 
        path: 'login', 
        component: LoginComponent,
        title: 'Metflex'
    }
];
