namespace Lab3_Ejeh_Ombao_
{
    using Amazon.DynamoDBv2;
    using Amazon.DynamoDBv2.DataModel;
    using Amazon.DynamoDBv2.DocumentModel;
    using Amazon.DynamoDBv2.Model;
    using Amazon.S3.Model;
    using Amazon.S3;

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
            // Upload the movie and image files to S3
            await _s3Service.UploadFileAsync(movieFilePath);
            await _s3Service.UploadFileAsync(imageFilePath);

            movie.MovieUrl = Path.GetFileName(movieFilePath);
            movie.ImageUrl = Path.GetFileName(imageFilePath);

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
            return await context.ScanAsync<Movie>(null).GetRemainingAsync();
        }

        // Update an existing movie
        public async Task<bool> UpdateMovieAsync(Movie movie)
        {
            var context = new DynamoDBContext(_dynamoDb);
            await context.SaveAsync(movie); 
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

            return filteredMovies;
        }



        // Search movies by genre
        public async Task<List<Movie>> GetMoviesByGenreAsync(string genre)
        {
            var context = new DynamoDBContext(_dynamoDb);

            // Perform a scan to filter by genre
            var scanConditions = new List<ScanCondition>
    {
        new ScanCondition("Genre", ScanOperator.Equal, genre)
    };

            var search = context.ScanAsync<Movie>(scanConditions);
            var result = await search.GetRemainingAsync();

            return result;
        }


        // Add a comment to a movie
        public async Task<bool> AddCommentToMovieAsync(string user, string movieId, string commentText)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null)
            {
                // Create a new comment with a unique ID
                var newComment = new Comment
                {
                    Id = movie.Comments.Count > 0 ? movie.Comments.Max(c => c.Id) + 1 : 1,
                    User = user,
                    Text = commentText,
                    
                };

                movie.Comments.Add(newComment);
                await context.SaveAsync(movie);
                return true;
            }
            return false;
        }


        public async Task<bool> EditCommentAsync(int commentId, string user, string movieId, string commentText)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null)
            {
                // Find the comment that matches the ID and user email
                var commentToEdit = movie.Comments
                    .FirstOrDefault(c => c.Id == commentId && c.User == user);

                if (commentToEdit != null)
                {
                    commentToEdit.Text = commentText;
                    await context.SaveAsync(movie);
                    return true;
                }
            }
            return false;
        }
        public async Task<bool> AddRatingToMovieAsync(string movieId, int ratingValue)
        {
            var context = new DynamoDBContext(_dynamoDb);
            var movie = await context.LoadAsync<Movie>(movieId);

            if (movie != null && ratingValue >= 1 && ratingValue <= 10) 
            {
                // Add the rating to the movie's ratings list
                movie.Ratings.Add(ratingValue);
                await context.SaveAsync(movie);
                return true;
            }
            return false;
        }


    }
}
