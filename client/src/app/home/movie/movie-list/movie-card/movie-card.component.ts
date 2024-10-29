import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../../../models/Movies';
import { UserSecurityService } from '../../../../services/user-security.service';
import { User } from '../../../../models/User';
import { MatMenuModule } from '@angular/material/menu';
import { MoviesService } from '../../service/movies.service';
import { MovieInfoFormComponent } from '../../shared/movie-info-form/movie-info-form.component';
import { MovieAddComponent } from '../../movie-add/movie-add.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  
  @Input({required: true})
  movie! : Movie 

  currentUser : User | null

  constructor(private userService : UserSecurityService, 
    private movieService: MoviesService,
    private dialogRef : MatDialog) {
    this.currentUser = userService.currentUser
  }

  private router : Router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  onClickMovieCard(id: number) {
    this.movieService.currentMovieSelected.set(this.movie)
    this.router.navigate([id], {relativeTo: this.activatedRoute})
  }

  onDeleteMovie(movieId : number, event: Event) {
    event.stopPropagation()
    this.movieService.deleteMovieById(movieId)
  }

  onMovieUpdate(movieToUpdate : Movie, event : Event) {
    event.stopPropagation();
    this.dialogRef.open(MovieAddComponent, {
      data: movieToUpdate
    })
  }
}
