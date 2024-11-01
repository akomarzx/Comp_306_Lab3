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
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCommentComponent } from './movie-comment/movie-comment.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [
    VjsPlayerComponent,
    AsyncPipe,
    MovieCommentComponent,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.scss',
})
export class MovieInformationComponent implements OnInit, OnDestroy {

  selectedMovie!: WritableSignal<Movie | null>;
  ratingsDropdown : FormControl = new FormControl(null, [Validators.required])

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

  addRating() {
    this.movieService.addRating(this.selectedMovie()?.id!, this.ratingsDropdown.value)
  }

}
