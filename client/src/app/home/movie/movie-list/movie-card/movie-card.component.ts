import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../../../models/Movies';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  
  @Input({required: true})
  movie! : Movie 

  private router : Router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  onClickMovieCard(id: number) {
    this.router.navigate([id], {relativeTo: this.activatedRoute})
  }

}
