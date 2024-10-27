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
        genre: ["Drama"],
        director: "Laura Bennett",
        releaseDate: "2023-07-12",
        owner: "r",
        rating: 4.2
      },
      {
        id: 2,
        title: "Forgotten Realms",
        summary: "An adventurous journey through a mystical land filled with ancient secrets and magical creatures.",
        genre: ["Fantasy"],
        director: "Daniel Kwan",
        releaseDate: "2022-09-18",
        owner: "r",
        rating: 8.5
      },
      {
        id: 3,
        title: "Beneath the Waves",
        summary: "A marine biologist uncovers dark secrets while researching a mysterious ocean phenomenon.",
        genre: ["Thriller"],
        director: "Maya Lopez",
        releaseDate: "2024-03-25",
        owner: "owner3@example.com",
        rating: 9.6
      },
      {
        id: 4,
        title: "Echoes of the Past",
        summary: "A young woman discovers her family's hidden history through a series of mysterious letters.",
        genre: ["Mystery"],
        director: "Tom Richards",
        releaseDate: "2023-11-05",
        owner: "owner4@example.com",
        rating: 7.2
      },
      {
        id: 5,
        title: "Stars Apart",
        summary: "sdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjkadkasldkalskldalskdlasdkaslkdlaskldklaskdlakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjal",
        genre: ["Sci-Fi", "Romance"],
        director: "Sophie Zhang",
        releaseDate: "2021-08-20",
        owner: "owner5@example.com",
        rating: 6.5
      },
            {
        id: 6,
        title: "Stars Apart Pt. 2",
        summary: "This is for testing",
        genre: ["Sci-Fi", "Romance"],
        director: "Sophie Zhang",
        releaseDate: "2021-08-20",
        owner: "owner5@example.com",
        rating: 6.5
      }
    ])
  }

  getAllMovies() {
    return this.moviesList$.asObservable()
  }

  addMovie(newMovie : Movie) {
    this.moviesList$.next([...this.moviesList$.getValue(), newMovie])
  }

  updateMovieById(movieId : number, updatedMovie : Movie) {

    const modifiedData : Movie[] = this.moviesList$.getValue().map(obj => {
      if(obj.id === movieId) {
        return {
          ...obj,
          title: updatedMovie.title,
          summary: updatedMovie.summary,
          director: updatedMovie.director,
          releaseDate: updatedMovie.releaseDate,
          genre: updatedMovie.genre
        }
      }
      return obj
    })

    this.moviesList$.next(modifiedData)
    
  }

  deleteMovieById(movieId : number) {
    let filteredMovieList : Movie[] = this.moviesList$.getValue().filter((movie : Movie) => movie.id !== movieId)
    this.moviesList$.next(filteredMovieList)
  }
}
