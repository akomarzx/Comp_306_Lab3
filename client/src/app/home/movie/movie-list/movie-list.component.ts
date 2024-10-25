import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieAddComponent } from './movie-add/movie-add.component';
import { MoviesService } from '../../../services/movies.service';
import { Observable } from 'rxjs';
import { Movie } from '../../../models/Movies';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    AsyncPipe
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

  onClickMovieCard(id: number) {
    this.router.navigate([id], {relativeTo: this.activedRoute})
  }
}
