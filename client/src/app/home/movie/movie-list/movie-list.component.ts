import { Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MoviesService } from '../../../services/movies.service';
import { debounce, debounceTime, Observable, single, Subject, take, takeUntil } from 'rxjs';
import { Movie } from '../../../models/Movies';
import { AsyncPipe } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

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
    MatSliderModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit, OnDestroy {

  private unsub : Subject<void> = new Subject<void>()
  
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  moviesList!: WritableSignal<Movie[]>
  genres: { name: string }[]
  selectedGenresForFilter: WritableSignal<{ name: string }[]>

  readonly chipInputControl = new FormControl(['']);
  readonly ratingSliderControl = new FormControl<string | number | null>('');
  
  constructor(private movieService: MoviesService) {
    
    this.genres = this.movieService.getAllGenres()
    this.moviesList = signal([])
    this.selectedGenresForFilter = signal([])
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
    console.log(obj.name);
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
    console.log(this.chipInputControl.value)
    console.log(this.ratingSliderControl.value)
  }

  onFilterClearClicked() {
    this.chipInputControl.reset();
    this.ratingSliderControl.reset();
    this.selectedGenresForFilter.set([])
  }
}
