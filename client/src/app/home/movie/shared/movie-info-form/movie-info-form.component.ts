import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MoviesService } from '../../../../services/movies.service';
import { Movie } from '../../../../models/Movies';
import { UserSecurityService } from '../../../../services/user-security.service';
import { MatDialogRef } from '@angular/material/dialog';

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
    MatNativeDateModule
  ],
  providers: [
    provideNativeDateAdapter()
  ]
})
export class MovieInfoFormComponent implements OnInit {

  ngOnInit(): void {
  }

  private fb = inject(FormBuilder);
  private movieService = inject(MoviesService)
  private userService = inject(UserSecurityService)
  private dialogRef = inject(MatDialogRef<MovieInfoFormComponent>)

  private get movieMetadaControls() {
    return this.movieMetadataForm.controls;
  }

  movieMetadataForm = this.fb.group({
      title: this.fb.nonNullable.control<String>('', [Validators.required]),
      summary: this.fb.nonNullable.control<String>('', [Validators.required, Validators.maxLength(250)]),
      genre: this.fb.nonNullable.control<String>('', [Validators.required]),
      director: this.fb.nonNullable.control<String>('', [Validators.required]),
      releaseDate: this.fb.nonNullable.control<String>('', [Validators.required])
  });

  genres = [
    {name: 'Drama'},
    {name: 'Romance'},
    {name: 'Horror'},
    {name: 'Sci-fi'},
    {name: 'Classic'},
    {name: 'Action'},
    {name: 'Suspense'},
  ];

  onSubmit(): void {

    let newMovie : Movie = {
      title: this.movieMetadaControls.title.value,
      director: this.movieMetadaControls.director.value,
      summary: this.movieMetadaControls.summary.value,
      releaseDate: this.movieMetadaControls.releaseDate.value,
      genre: this.movieMetadaControls.genre.value,
      id: 10,
      owner: this.userService.currentUser?.username!,
      rating: null
    }

    this.movieService.addMovie(newMovie)
    
    this.dialogRef.close("Success!")
  }


}
