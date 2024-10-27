import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieInfoFormComponent } from '../shared/movie-info-form/movie-info-form.component';
import { take } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [
    MovieInfoFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './movie-add.component.html',
  styleUrl: './movie-add.component.scss'
})
export class MovieAddComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MovieAddComponent, boolean>) { }
  private snackBar = inject(MatSnackBar)

  ngOnInit(): void {

    this.dialogRef.afterClosed().pipe(
      take(1),
    ).subscribe((result) => {
      if (result) {
        this.snackBar.open('Movie Successfully Added/Edited', 'Confirm', {
          duration: 3000
        })
      }
    })
  }
}
