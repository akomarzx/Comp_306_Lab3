export interface Movie {
    id: number | null
    title: string,
    summary: string,
    genre: string[],
    director: string,
    releaseDate: string,
    owner: string,
    movieUrl: string | null,
    imageUrl: string | null,
    rating: number,
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
    id: number | null,
    username: string,
    content: string,
    timestamp: Date
}