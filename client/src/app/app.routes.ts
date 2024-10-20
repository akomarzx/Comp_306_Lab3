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
        component: HomeComponent,
        // canActivate: [
        //     () => {
        //         const router = inject(Router)
        //         const userService = inject(UserSecurityService)
        //         if (userService.isAuthenticated()) {
        //             return true
        //         } else {
        //             router.navigate(['/login'])
        //             return false
        //         }
        //     }
        // ],
        children : [
            {path: 'movies', component: MovieListComponent},
            {path: 'movise/:id', component: MovieInformationComponent}
        ]
    },
    { path: 'login', component: LoginComponent }
];
