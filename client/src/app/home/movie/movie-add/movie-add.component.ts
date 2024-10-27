import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieInfoFormComponent } from '../shared/movie-info-form/movie-info-form.component';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [
    MovieInfoFormComponent
  ],
  templateUrl: './movie-add.component.html',
  styleUrl: './movie-add.component.scss'
})
export class MovieAddComponent {

  constructor(public dialogRef : MatDialogRef<MovieAddComponent>) {}

}
