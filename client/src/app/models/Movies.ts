export interface MovieApi {
    movieId: string | null | undefined
    title: string,
    summary: string,
    genre: string,
    director: string,
    releaseDate: string,
    owner: string,
    movieUrl: string,
    imageUrl: string,
    ratings: number[],
    comments: Comment[]
}

export interface Movie {
    id: string | null
    title: string,
    summary: string,
    genre: string,
    director: string,
    releaseDate: string,
    owner: string,
    movieUrl: string,
    imageUrl: string,
    rating: number,
    comments: Comment[]
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
    id: string,
    username: string,
    content: string,
    timestamp: Date
}

export interface MovieUploadResponse {
    s3Url: string
}