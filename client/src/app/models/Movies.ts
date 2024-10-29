export interface Movie {
    id: number
    title: String,
    summary: String,
    genre: String[],
    director: String,
    releaseDate: String,
    owner: String,
    url: string | null,
    rating: number | null
}

export interface MovieListResponse {
    count: number
    results : Movie[]
}

export interface Comments {
    movieId: number,
    comments: Comment[]
}

export interface Comment {
    username: string,
    content: string,
    timestamp: Date
}