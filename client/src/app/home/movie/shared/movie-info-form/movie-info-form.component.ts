import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

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
export class MovieInfoFormComponent {

  private fb = inject(FormBuilder);

  movieMetadataForm = this.fb.group({
      title: [null, Validators.required],
      genre: [null, Validators.required],
      director: [null, Validators.required],
      releaseDate: [null, Validators.required],
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
    alert('Thanks!');
  }
}
