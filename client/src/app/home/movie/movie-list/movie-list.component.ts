import { Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MoviesService } from '../service/movies.service';
import { debounce, debounceTime, Observable, single, Subject, take, takeUntil } from 'rxjs';
import { Movie } from '../../../models/Movies';
import { AsyncPipe } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import log from 'video.js/dist/types/utils/log';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    MovieCardComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatCheckbox
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit, OnDestroy {

  private unsub: Subject<void> = new Subject<void>()

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly chipInputControl = new FormControl<string[] | null>(null);
  readonly ratingSliderControl = new FormControl<string | number | null>(1);

  moviesList!: WritableSignal<Movie[]>
  genres: { name: string }[]
  selectedGenresForFilter: WritableSignal<{ name: string }[]>
  enableRatingsFilter: WritableSignal<boolean>

  constructor(private movieService: MoviesService, private fb: FormBuilder) {
    this.ratingSliderControl.disable()
    this.genres = this.movieService.getAllGenres()
    this.moviesList = signal([])
    this.selectedGenresForFilter = signal([])
    this.enableRatingsFilter = signal(false)
  }

  ngOnInit(): void {
    this.movieService.getAllMovies().pipe(
      takeUntil(this.unsub),
    ).subscribe(movies => {
      this.moviesList?.set(movies)
    })
  }

  ngOnDestroy(): void {
    this.unsub.next()
  }

  remove(obj: { name: string }): void {
    this.selectedGenresForFilter.update(genre => {
      return genre.filter((value) => value.name !== obj.name)
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.selectedGenresForFilter().findIndex(value => value.name === event.option.value)
    if (index < 0) {
      this.selectedGenresForFilter.update(genresSelected => [...genresSelected, { name: event.option.viewValue }]);
      event.option.deselect();
    }
  }

  onFilterClicked() {
    if (this.chipInputControl.value != null || this.ratingSliderControl.enabled) {
      let ratingValueToFilter = this.ratingSliderControl.enabled ? this.ratingSliderControl.value as number : null
      this.movieService.filterMovies(this.chipInputControl.value, ratingValueToFilter).pipe(
        takeUntil(this.unsub)
      ).subscribe((value) => {
        this.moviesList.set(value)
      })
    }
  }

  onFilterClearClicked() {
    this.movieService.getAllMovies().pipe(
      take(1),
    ).subscribe(movies => {
      this.moviesList?.set(movies)
    })
    this.chipInputControl.reset();
    this.selectedGenresForFilter.set([])
    this.ratingSliderControl.disable()
    this.enableRatingsFilter.set(false)
  }

  toggleEnableRatingFilter() {
    if (this.ratingSliderControl.disabled) {
      this.ratingSliderControl.enable()
      this.ratingSliderControl.setValue(1)
    } else {
      this.ratingSliderControl.disable()
      this.ratingSliderControl.setValue(1)
    }
  }

}
