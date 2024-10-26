import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/Movies'
import { UserSecurityService } from './user-security.service';
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private moviesList$: BehaviorSubject<Movie[]>

  constructor(private userService: UserSecurityService) {
    this.moviesList$ = new BehaviorSubject<Movie[]>([
      {
        id: 1,
        title: "Eclipse of the Heart",
        summary: "A gripping tale of love and betrayal set against a backdrop of political intrigue.",
        genre: "Drama",
        director: "Laura Bennett",
        releaseDate: "2023-07-12",
        owner: "owner1@example.com"
      },
      {
        id: 2,
        title: "Forgotten Realms",
        summary: "An adventurous journey through a mystical land filled with ancient secrets and magical creatures.",
        genre: "Fantasy",
        director: "Daniel Kwan",
        releaseDate: "2022-09-18",
        owner: "owner2@example.com"
      },
      {
        id: 3,
        title: "Beneath the Waves",
        summary: "A marine biologist uncovers dark secrets while researching a mysterious ocean phenomenon.",
        genre: "Thriller",
        director: "Maya Lopez",
        releaseDate: "2024-03-25",
        owner: "owner3@example.com"
      },
      {
        id: 4,
        title: "Echoes of the Past",
        summary: "A young woman discovers her family's hidden history through a series of mysterious letters.",
        genre: "Mystery",
        director: "Tom Richards",
        releaseDate: "2023-11-05",
        owner: "owner4@example.com"
      },
      {
        id: 5,
        title: "Stars Apart",
        summary: "In a future where humanity has colonized other planets, two star-crossed lovers fight to stay connected.",
        genre: "Sci-Fi Romance",
        director: "Sophie Zhang",
        releaseDate: "2021-08-20",
        owner: "owner5@example.com"
      }
    ])
  }

  getAllMovies() {
    return this.moviesList$.asObservable()
  }

  addMovie(newMovie : Movie) {
    this.moviesList$.next([...this.moviesList$.getValue(), newMovie])
  }
}
