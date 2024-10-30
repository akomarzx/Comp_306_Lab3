import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, filter, Observable, of, Subject } from 'rxjs';
import { Comment, Comments, Movie } from '../../../models/Movies';
import { UserSecurityService } from '../../../services/user-security.service';
@Injectable({
  providedIn: 'root',
})
export class MoviesService {

  #moviesList$: BehaviorSubject<Movie[]>;

  currentMovieSelected: WritableSignal<Movie | null>

  constructor(private userService: UserSecurityService) {

    this.currentMovieSelected = signal(null)

    this.#moviesList$ = new BehaviorSubject<Movie[]>([
      {
        id: 1,
        title: 'Eclipse of the Heart',
        summary:
          'A gripping tale of love and betrayal set against a backdrop of political intrigue.',
        genre: ['Drama'],
        director: 'Laura Bennett',
        releaseDate: '2023-07-12',
        owner: 'r',
        rating: 4.2,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
      {
        id: 2,
        title: 'Forgotten Realms',
        summary:
          'An adventurous journey through a mystical land filled with ancient secrets and magical creatures.',
        genre: ['Fantasy'],
        director: 'Daniel Kwan',
        releaseDate: '2022-09-18',
        owner: 'r',
        rating: 8.5,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
      {
        id: 3,
        title: 'Beneath the Waves',
        summary:
          'A marine biologist uncovers dark secrets while researching a mysterious ocean phenomenon.',
        genre: ['Thriller'],
        director: 'Maya Lopez',
        releaseDate: '2024-03-25',
        owner: 'owner3@example.com',
        rating: 9.6,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
      {
        id: 4,
        title: 'Echoes of the Past',
        summary:
          "A young woman discovers her family's hidden history through a series of mysterious letters.",
        genre: ['Mystery'],
        director: 'Tom Richards',
        releaseDate: '2023-11-05',
        owner: 'owner4@example.com',
        rating: 7.2,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
      {
        id: 5,
        title: 'Stars Apart',
        summary:
          'sdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjkadkasldkalskldalskdlasdkaslkdlaskldklaskdlakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjalsjldkjakljsdhjasdhjlasdjal',
        genre: ['Sci-Fi', 'Romance'],
        director: 'Sophie Zhang',
        releaseDate: '2021-08-20',
        owner: 'owner5@example.com',
        rating: 6.5,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
      {
        id: 6,
        title: 'Stars Apart Pt. 2',
        summary: 'This is for testing',
        genre: ['Sci-Fi', 'Romance'],
        director: 'Sophie Zhang',
        releaseDate: '2021-08-20',
        owner: 'owner5@example.com',
        rating: 6.5,
        movieUrl: './assets/aaa.mp4',
        imageUrl: './assets/aaa.mp4'
      },
    ]);
  }

  getAllGenres() {
    return [
      { name: 'Drama' },
      { name: 'Romance' },
      { name: 'Horror' },
      { name: 'Sci-fi' },
      { name: 'Classic' },
      { name: 'Action' },
      { name: 'Suspense' },
    ];
  }

  #movieComments: BehaviorSubject<Comments> = new BehaviorSubject<Comments>(
    {
      movieId: 1,
      comments: [
        {
          id: 1,
          username: 'Ronald',
          content: "Hello World",
          timestamp: new Date()
        },
        {
          id: 2,
          username: 'Ronald',
          content: "Nice Movie!",
          timestamp: new Date()
        },
      ]
    }
  )

  getAllMovies() {
    return this.#moviesList$.asObservable();
  }


  addMovie(newMovie: Movie) {
    this.#moviesList$.next([...this.#moviesList$.getValue(), newMovie]);
  }

  updateMovieById(movieId: number, updatedMovie: Movie) {
    const modifiedData: Movie[] = this.#moviesList$.getValue().map((obj) => {
      if (obj.id === movieId) {
        return {
          ...obj,
          title: updatedMovie.title,
          summary: updatedMovie.summary,
          director: updatedMovie.director,
          releaseDate: updatedMovie.releaseDate,
          genre: updatedMovie.genre,
        };
      }
      return obj;
    });

    this.#moviesList$.next(modifiedData);
  }

  deleteMovieById(movieId: number) {
    let filteredMovieList: Movie[] = this.#moviesList$
      .getValue()
      .filter((movie: Movie) => movie.id !== movieId);
    this.#moviesList$.next(filteredMovieList);
  }

  getMovieCommentsById(movieId: number): Observable<Comments> {
    return this.#movieComments.asObservable()
  }

  addMovieComment(newComment: Comment) {
    let comments: Comments = this.#movieComments.getValue()
    comments.comments = [...comments.comments, newComment]
    this.#movieComments.next(comments)
  }

  updateCommentByCommentId(commentId: number, updatedComment: string) {
    const modifiedData: Comment[] = this.#movieComments.getValue().comments.map((obj) => {
      if (obj.id === commentId) {
        return {
          ...obj,
          content: updatedComment,
          timestamp: new Date()
        };
      }
      return obj;
    });

    let comments: Comments = this.#movieComments.getValue()
    comments.comments = modifiedData

    this.#movieComments.next(comments)
  }

  filterMovies(genreArray: string[] | null, rating: number | null): Movie[] {
    console.log(rating);
    console.log(genreArray);
    
    let filteredMovieList: Movie[] = []
    
    if (genreArray) {
      filteredMovieList = this.#moviesList$.getValue().filter(movie => {
        return movie.genre.some(genre => genreArray.includes(genre))
      })
    }

    if (rating) {
      let whichArray : Movie[] = []
      if (genreArray == null || genreArray.length < 1) {
        whichArray = this.#moviesList$.getValue()
      } else {
        whichArray = filteredMovieList
      }

      filteredMovieList = whichArray.filter(movie => {
        return movie.rating >= rating
      })
    }

    return filteredMovieList
  }
}
