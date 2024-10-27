export interface Movie {
    id: number
    title: String,
    summary: String,
    genre: String,
    director: String,
    releaseDate: String,
    owner: string,
    rating: number | null
}

export interface MovieListResponse {
    count: number
    results : [Movie]
}