import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MoviesService } from '../../../services/movies.service';
import { Observable } from 'rxjs';
import { Movie } from '../../../models/Movies';
import { AsyncPipe } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    MovieCardComponent,
    MatButtonModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {

  constructor( private movieService: MoviesService){}

  moviesList$? : Observable<Movie[]>

  ngOnInit(): void {
    this.moviesList$ = this.movieService.getAllMovies()
  }

}
