namespace Lab3_Ejeh_Ombao_
{
    using Amazon.DynamoDBv2;
    using Amazon.DynamoDBv2.DataModel;
    using Amazon.DynamoDBv2.DocumentModel;
    using Amazon.DynamoDBv2.Model;
    using Amazon.S3.Model;
    using Amazon.S3;
    using System.Globalization;

    public class MovieRepository
    {
        private readonly IAmazonDynamoDB _dynamoDb;
        private readonly S3Service _s3Service;

        public MovieRepository(IAmazonDynamoDB dynamoDb, S3Service s3Service)
        {
            _dynamoDb = dynamoDb;
            _s3Service = s3Service;
        }

        // Create a new movie
        public async Task<bool> CreateMovieAsync(Movie movie, string movieFilePath, string imageFilePath)
        {
            movie.MovieId = Guid.NewGuid().ToString();
            // Upload the movie and image files to S3
            var context = new DynamoDBContext(_dynamoDb);
            await context.SaveAsync(movie);
            return true;
        }

        // Get a movie by ID
        public async Task<Movie> GetMovieByIdAsync(string id)
        {
            var context = new DynamoDBContext(_dynamoDb);
            return await context.LoadAsync<Movie>(id);
        }

        // Get all movies
        public async Task<List<Movie>> GetAllMoviesAsync()
        {
            var context = new DynamoDBContext(_dynamoDb);
            List<Movie> movies = await context.ScanAsync<Movie>(null).GetRemainingAsync(); 
            movies.ForEach(movies => {
                movies.Ratings ??= new List<int>();
            });
            return movies;
        }

        // Update an existing movie
        public async Task<bool> UpdateMovieAsync(string movieId, UpdateMovie movie)
        {
            var context = new DynamoDBContext(_dynamoDb);
            Movie movieToBeUpdated = await context.LoadAsync<Movie>(movieId);

            movieToBeUpdated.Title = movie.Title;
            movieToBeUpdated.Summary = movie.Summary;
            movieToBeUpdated.Genre = movie.Genre;
            movieToBeUpdated.Director = movie.Director;
            movieToBeUpdated.ReleaseDate = movie.ReleaseDate;

            await context.SaveAsync(movieToBeUpdated); 
            
            return true;
        }

        public async Task<Stream> DownloadMovieAsync(string movieId)
        {
            var context = new DynamoDBContext(_dynamoDb);

            // Load the existing movie from DynamoDB
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie == null || string.IsNullOrEmpty(movie.MovieUrl))
            {
                throw new Exception("Movie not found or URL is missing.");
            }

            // Download the movie file from S3
            return await _s3Service.DownloadFileAsync(movie.MovieUrl);
        }


        // Delete a movie
        public async Task<bool> DeleteMovieAsync(string id)
        {
            var context = new DynamoDBContext(_dynamoDb);

            // Load the movie from DynamoDB
            var movie = await context.LoadAsync<Movie>(id);
            if (movie != null)
            {
                // Delete the associated files from S3
                if (!string.IsNullOrEmpty(movie.MovieUrl))
                {
                    await _s3Service.DeleteFileAsync(movie.MovieUrl);
                }
                if (!string.IsNullOrEmpty(movie.ImageUrl))
                {
                    await _s3Service.DeleteFileAsync(movie.ImageUrl);
                }

                // Delete the movie record from DynamoDB
                await context.DeleteAsync(movie);
                return true;
            }
            return false; 
        }

        // Search movies by rating greater than a specified value
        public async Task<List<Movie>> GetMoviesByAverageRatingAsync(int minAverageRating)
        {
            var context = new DynamoDBContext(_dynamoDb);

            // Scan for all movies
            var search = context.ScanAsync<Movie>(new List<ScanCondition>());
            var movies = new List<Movie>();

            do
            {
                var batch = await search.GetNextSetAsync();
                movies.AddRange(batch);
            } while (!search.IsDone); 

            // Filter movies based on average rating
            var filteredMovies = movies.Where(movie =>
                movie.Ratings != null && movie.Ratings.Count > 0 &&
                movie.Ratings.Average() > minAverageRating).ToList();

            filteredMovies.ForEach(movies => {
                movies.Ratings ??= new List<int>();
            });

            return filteredMovies;
        }



        // Search movies by genre
        public async Task<List<Movie>> GetMoviesByGenreAsync(string genre)
        {
            var context = new DynamoDBContext(_dynamoDb);

            // Perform a scan to filter by genre
            var scanConditions = new List<ScanCondition>
    {
        new ScanCondition("Genre", ScanOperator.Contains, genre)
    };

            var search = context.ScanAsync<Movie>(scanConditions);
            var result = await search.GetRemainingAsync();

            result.ForEach(movies => {
                movies.Ratings ??= new List<int>();
            });

            return result;
        }


        // Add a comment to a movie
        public async Task<Comment> AddCommentToMovieAsync(string user, string movieId, string commentText)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null)
            {
                // Create a new comment with a unique ID
                var newComment = new Comment
                {
                    Id = Guid.NewGuid().ToString(),
                    User = user,
                    Text = commentText,
                    CreatedAt = DateTime.Now
                };

                movie.Comments.Add(newComment);
                await context.SaveAsync(movie);
                return newComment;
            }
            return null;
        }


        public async Task<Comment> EditCommentAsync(string movieId, Comment updatedComment)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null)
            {
                // Find the comment that matches the ID and user email
                var commentToEdit = movie.Comments
                    .FirstOrDefault(c => c.Id == updatedComment.Id && c.User == updatedComment.User);

                if (commentToEdit != null)
                {
                    commentToEdit.Text = updatedComment.Text;
                    commentToEdit.CreatedAt = DateTime.Now;
                    await context.SaveAsync(movie);
                    return updatedComment;
                }
            }
            return null;
        }
        public async Task<bool> AddRatingToMovieAsync(string movieId, int ratingValue)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null && ratingValue >= 1 && ratingValue <= 10) 
            {
                if(movie.Ratings is null) {
                    movie.Ratings = new List<int>();
                }
                // Add the rating to the movie's ratings list
                movie.Ratings.Add(ratingValue);
                await context.SaveAsync(movie);
                return true;
            }
            return false;
        }


    }
}
