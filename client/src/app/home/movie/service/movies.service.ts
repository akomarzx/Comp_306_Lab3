import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  distinct,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  reduce,
  Subject,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs';
import { Comment, Comments, Movie, MovieApi, MovieUploadResponse } from '../../../models/Movies';
import { UserSecurityService } from '../../../services/user-security.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  
  #apiUri = environment.apiUri;

  #moviesList$: BehaviorSubject<Movie[]>;

  #movieComments: BehaviorSubject<Comment[] | null> 
  currentMovieSelected: WritableSignal<Movie | null>;

  constructor(
    private userService: UserSecurityService,
    private http: HttpClient
  ) {
    this.currentMovieSelected = signal(null);
    this.#moviesList$ = new BehaviorSubject<Movie[]>([]);
    this.#movieComments= new BehaviorSubject<Comment[] | null>(null);
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
      { name: 'Comedy' },
    ];
  }

  getAllMovies() {
    this.http.get<MovieApi[]>(`${this.#apiUri}/movies`).subscribe((result) => {
      let uiMovie: Movie[] = result.map<Movie>((value) => {
        return {
          ...value,
          id: value.movieId!,
          rating:
            value.ratings.length > 1
              ? parseFloat(
                  (
                    value.ratings.reduce((a, b) => a + b, 0) /
                    value.ratings?.length
                  ).toFixed(1)
                )
              : 0,
            comments: value.comments
        };
      });
      this.#moviesList$.next(uiMovie);
    });

    return this.#moviesList$.asObservable();
  }

  addMovie(newMovie: MovieApi) {
    this.http
      .post<MovieApi>(`${this.#apiUri}/movies/create-movie`, newMovie)
      .subscribe((result) => {
        let movieUi: Movie = {
          ...newMovie,
          id: result?.movieId!,
          rating:
            newMovie.ratings.length > 1
              ? parseFloat(
                  (
                    newMovie.ratings?.reduce((a, b) => a + b, 0) /
                    newMovie.ratings?.length
                  ).toFixed(1)
                )
              : 0,
        };
        this.#moviesList$.next([...this.#moviesList$.getValue(), movieUi]);
      });
  }

  updateMovieById(movieId: string, updatedMovie: MovieApi) {

    let body = {
      Title: updatedMovie.title,
      Summary: updatedMovie.summary,
      Genre: updatedMovie.genre,
      Director: updatedMovie.director,
      ReleaseDate: updatedMovie.releaseDate,
    };

    this.http.put(`${this.#apiUri}/movies/${movieId}`, body).subscribe(() => {
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
    });
  }

  deleteMovieById(movieId: string) {
    this.http.delete(`${this.#apiUri}/movies/${movieId}`).subscribe((next) => {
      let filteredMovieList: Movie[] = this.#moviesList$
        .getValue()
        .filter((movie: Movie) => movie.id !== movieId);
      this.#moviesList$.next(filteredMovieList);
    });
  }

  getMovieCommentsById(movieId: string): Observable<Comment[] | null> {
    let list = this.#moviesList$.getValue().filter(movie => {
      return movie.id === movieId
    }).at(0)?.comments
    
    list = list ? list : []

    this.#movieComments.next(list)

    return this.#movieComments.asObservable()
  }

  addMovieComment(newComment: Comment, movieId : string) {
    this.http.post<Comment>(`${this.#apiUri}/movies/${movieId}/comment`, newComment).subscribe((result) => {
      let comments = this.#movieComments.getValue()
      if(comments == null) {
        comments = []
      }
      comments = [...comments!, newComment]
      this.#movieComments.next(comments);
    })

  }

  updateCommentByCommentId(movieId : string, commentId: string, updatedComment: string) {

    if(this.#movieComments.getValue() != null) {
      
      let comment : Comment = {
        username: this.userService.currentUser?.username!,
        timestamp: new Date(),
        content: updatedComment,
        id: commentId
      }

      this.http.put<Comment>(`${this.#apiUri}/movies/${this.currentMovieSelected()?.id}/comment`, comment).subscribe((result) => {
        const modifiedData: Comment[] = this.#movieComments.getValue()!.map((obj) => {
        if (obj.id === commentId) {
          return {
            ...obj,
            content: result.content,
            timestamp: new Date(result.timestamp),
            };
          }
          return obj;
        });
        let comments: Comment[] | null = this.#movieComments.getValue()
        if(comments) {
          comments = modifiedData;
        }
        this.#movieComments.next(comments);
      })
    }
  }

  filterMovies(
    genreArray: string[] | null,
    rating: number | null
  ): Observable<Movie[]> {
    let genreFilter = this.http.get<MovieApi[]>(
      `${this.#apiUri}/movies/filter-genre/?genre=${genreArray?.join(',')}`
    );

    let obsRequests: Observable<MovieApi[]>[] = [genreFilter];

    if (rating != null) {
      let ratingsFilter = this.http.get<MovieApi[]>(
        `${this.#apiUri}/movies/filter-rating/?rating=${rating}`
      );
      obsRequests = [...obsRequests, ratingsFilter];
    }

    return forkJoin(obsRequests).pipe(
      take(1),
      map((results) => results.reduce((all, itm) => all.concat(itm), [])),
      concatMap((value) => from(value)),
      distinct((movie) => movie?.movieId),
      map((value) => {
        return {
          ...value,
          id: value.movieId!,
          rating:
            value.ratings.length > 1
              ? parseFloat(
                  (
                    value.ratings.reduce((a, b) => a + b, 0) /
                    value.ratings?.length
                  ).toFixed(1)
                )
              : 0,
        };
      }),
      toArray()
    );
  }

  uploadFileToS3(formData : FormData) : Observable<MovieUploadResponse> {
    return this.http.post<MovieUploadResponse>(`${this.#apiUri}/movies/upload`, formData);
  }

  addRating(movieId: string, rating: number) {
    
    this.http.post(`${this.#apiUri}/${movieId}/movies/rating`, rating).subscribe(() => {
      this.getAllMovies()
    })
  }

}
