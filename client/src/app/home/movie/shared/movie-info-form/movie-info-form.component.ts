import { Component, Inject, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MoviesService } from '../../service/movies.service';
import { Movie } from '../../../../models/Movies';
import { UserSecurityService } from '../../../../services/user-security.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info-form',
  templateUrl: './movie-info-form.component.html',
  styleUrl: './movie-info-form.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ]
})
export class MovieInfoFormComponent implements OnInit {

  ngOnInit(): void {
    if (this.movieToBeUpdated) {
      this.movieMetadataForm.patchValue(this.movieToBeUpdated);
    }
  }

  private fb = inject(FormBuilder);
  private movieService = inject(MoviesService)
  private userService = inject(UserSecurityService)
  private dialogRef : MatDialogRef<MovieInfoFormComponent, boolean>= inject(MatDialogRef<MovieInfoFormComponent, boolean>)
  private movieToBeUpdated: Movie | null
  genres: {name: string}[]

  constructor(@Inject(MAT_DIALOG_DATA) public data : Movie) {
    this.movieToBeUpdated = data
    this.genres = this.movieService.getAllGenres()
  }

  private get movieMetadaControls() {
    return this.movieMetadataForm.controls;
  }

  movieMetadataForm = this.fb.group({
      title: this.fb.nonNullable.control<String>('', [Validators.required]),
      summary: this.fb.nonNullable.control<String>('', [Validators.required, Validators.maxLength(250)]),
      genre: this.fb.nonNullable.control<String[]>([], [Validators.required]),
      director: this.fb.nonNullable.control<String>('', [Validators.required]),
      releaseDate: this.fb.nonNullable.control<String>('', [Validators.required])
  });

  onSubmit(event : Event): void {

    event.stopPropagation();

    let movie : Movie = {
      title: this.movieMetadaControls.title.value,
      director: this.movieMetadaControls.director.value,
      summary: this.movieMetadaControls.summary.value,
      releaseDate: this.movieMetadaControls.releaseDate.value,
      genre: this.movieMetadaControls.genre.value,
      id: 10,
      owner: this.userService.currentUser?.username!,
      rating: 0.0,
      url: './assets/aaa.mp4'
    }

    if(this.movieToBeUpdated) {
      this.movieService.updateMovieById(this.movieToBeUpdated.id, movie)
    } else {
      this.movieService.addMovie(movie)
    }

    this.dialogRef.close(true)

  }

  onCancel(event : Event) {
    event.stopPropagation();
    this.dialogRef.close()
  }

}
