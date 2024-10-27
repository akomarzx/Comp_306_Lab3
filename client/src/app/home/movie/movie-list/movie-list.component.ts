import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieAddComponent } from '../movie-add/movie-add.component';
import { MoviesService } from '../../../services/movies.service';
import { Observable } from 'rxjs';
import { Movie } from '../../../models/Movies';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    AsyncPipe,
    MovieCardComponent,
    MatButtonModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {

  activedRoute = inject(ActivatedRoute)

  constructor(private dialog : MatDialog, 
    private movieService: MoviesService, 
    private router : Router){}

  moviesList$? : Observable<Movie[]>

  ngOnInit(): void {
    this.moviesList$ = this.movieService.getAllMovies()
  }

  onAddMovie() {
    let dialogRef = this.dialog.open(MovieAddComponent)
  }

}
