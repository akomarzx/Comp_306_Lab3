import { Component, Inject, inject, OnInit, signal, WritableSignal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MoviesService } from '../../service/movies.service';
import { Movie, MovieApi, MovieUploadResponse } from '../../../../models/Movies';
import { UserSecurityService } from '../../../../services/user-security.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { take, takeUntil } from 'rxjs';

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
    provideNativeDateAdapter(),
  ]
})
export class MovieInfoFormComponent implements OnInit {

  ngOnInit(): void {
    if (this.movieToBeUpdated) {
      this.movieMetadataForm.patchValue({
        title: this.movieToBeUpdated.title,
        summary: this.movieToBeUpdated.summary,
        genre: this.movieToBeUpdated.genre.split(','),
        director: this.movieToBeUpdated.director,
        releaseDate: this.movieToBeUpdated.releaseDate,
        imageUrl: this.movieToBeUpdated.imageUrl,
        movieUrl: this.movieToBeUpdated.movieUrl
      });
    }
  }

  private fb = inject(FormBuilder);
  private movieService = inject(MoviesService)
  private userService = inject(UserSecurityService)
  private dialogRef : MatDialogRef<MovieInfoFormComponent, boolean>= inject(MatDialogRef<MovieInfoFormComponent, boolean>)
  movieToBeUpdated: Movie | null
  
  genres: {name: string}[]

  constructor(@Inject(MAT_DIALOG_DATA) public data : Movie, private httpCient: HttpClient) {
    this.movieToBeUpdated = data
    this.genres = this.movieService.getAllGenres()
  }

  private get movieMetadaControls() {
    return this.movieMetadataForm.controls;
  }

  movieMetadataForm = this.fb.group({
      title: this.fb.nonNullable.control<string>('', [Validators.required]),
      summary: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(250)]),
      genre: this.fb.nonNullable.control<string[]>([], [Validators.required]),
      director: this.fb.nonNullable.control<string>('', [Validators.required]),
      releaseDate: this.fb.nonNullable.control<string>('', [Validators.required]),
      imageUrl: this.fb.nonNullable.control<string>('', [Validators.required]),
      movieUrl: this.fb.nonNullable.control<string>('', [Validators.required])
  });

  onSubmit(event : Event): void {

    event.stopPropagation();

    console.log(this.movieMetadataForm.getRawValue())

    let movie : MovieApi = {
      title: this.movieMetadaControls.title.value,
      director: this.movieMetadaControls.director.value,
      summary: this.movieMetadaControls.summary.value,
      releaseDate: this.movieMetadaControls.releaseDate.value,
      genre: this.movieMetadaControls.genre.value.join(),
      movieId: '',
      owner: this.userService.currentUser?.username!,
      ratings: [],
      imageUrl: this.movieMetadaControls.imageUrl.value,
      movieUrl: this.movieMetadaControls.movieUrl.value,
      comments: []
    }
    
    if(this.movieToBeUpdated) {
      this.movieService.updateMovieById(this.movieToBeUpdated.id!, movie)
    } else {
      this.movieService.addMovie(movie)
    }

    this.dialogRef.close(true)

  }

  onCancel(event : Event) {
    event.stopPropagation();
    this.dialogRef.close()
  }

  onImageFileChanged(event: any) {

    const formData = new FormData();
    formData.append('file', event.target?.files[0], `test-${new Date().toDateString()}`);

    this.movieService.uploadFileToS3(formData).pipe(take(1)).subscribe((result) => {
      console.log(result.s3Url)
      this.movieMetadataForm.patchValue({imageUrl: result.s3Url})
      this.movieMetadataForm.updateValueAndValidity()
    })
  }

  onMovieFileChanged(event: any) {
    
    const formData = new FormData();
    formData.append('file', event.target?.files[0], `test-${new Date().toDateString()}`);

    this.movieService.uploadFileToS3(formData).pipe(take(1)).subscribe((result) => {
      console.log(result.s3Url)
      this.movieMetadataForm.patchValue({movieUrl: result.s3Url})
      this.movieMetadataForm.updateValueAndValidity()
    })

  }
}
