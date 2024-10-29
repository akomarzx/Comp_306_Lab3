import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import { Movie } from '../../../models/Movies';
import { MoviesService } from '../service/movies.service';
import { UserSecurityService } from '../../../services/user-security.service';
import { AsyncPipe } from '@angular/common';
import { MovieCommentComponent } from './movie-comment/movie-comment.component';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [
    VjsPlayerComponent,
    AsyncPipe,
    MovieCommentComponent
  ],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.scss',
})
export class MovieInformationComponent implements OnInit, OnDestroy {

  selectedMovie!: WritableSignal<Movie | null>;

  constructor(
    private movieService: MoviesService,
    private userService: UserSecurityService
  ) {
    this.selectedMovie = this.movieService.currentMovieSelected;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}
