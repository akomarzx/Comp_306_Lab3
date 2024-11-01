using Amazon.DynamoDBv2.DataModel;
using Amazon.Util.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lab3_Ejeh_Ombao_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly MovieRepository _movieRepository;
        private readonly S3Service _s3Service;
        public MoviesController(MovieRepository movieRepository, S3Service s3Service)
        {
            _movieRepository = movieRepository;
            _s3Service = s3Service;
        }

        [HttpPost("create-movie")]
        public async Task<IActionResult> CreateMovie([FromBody] Movie movie)
        {
            var success = await _movieRepository.CreateMovieAsync(movie, movie.MovieUrl, movie.ImageUrl);
            if (success)
            {
                return CreatedAtAction(nameof(GetMovieById), new { id = movie.MovieId }, movie);
            }
            return BadRequest("Unable to create movie.");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(string id)
        {
            var movie = await _movieRepository.GetMovieByIdAsync(id);
            if (movie == null)
            {
                return NotFound();
            }
            return movie;
        }

        [HttpGet]
        public async Task<ActionResult<List<Movie>>> GetAllMovies()
        {
            var movies = await _movieRepository.GetAllMoviesAsync();
            return movies;
        }
        [HttpGet("download/{movieId}")]
        public async Task<IActionResult> DownloadMovie(string movieId)
        {
            var movie = await _movieRepository.GetMovieByIdAsync(movieId);
            try
            {
                var stream = await _movieRepository.DownloadMovieAsync(movieId);
                var movieName = Path.GetFileName(movie.MovieUrl);

                // Return the file as a download
                return File(stream, "video/mp4", movieName);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(string id, [FromBody] UpdateMovie movie)
        {
            await _movieRepository.UpdateMovieAsync(id, movie);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteMovie(string id)
        {
            var success = await _movieRepository.DeleteMovieAsync(id);
            if (!success)
            {
                return false;
            }
            return true;
        }

        [HttpGet("filter-rating")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByRating([FromQuery(Name = "rating")] int minRating)
        {
            return await _movieRepository.GetMoviesByAverageRatingAsync(minRating);
        }

        [HttpGet("filter-genre")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByGenre([FromQuery(Name = "genre")] string genre)
        {
            return await _movieRepository.GetMoviesByGenreAsync(genre);
        }

        // POST: api/movie/{movieId}/comment
        [HttpPost("{movieId}/comment")]
        public async Task<ActionResult<Comment>> AddComment(string movieId, [FromBody] Comment comment)
        {
            if (comment == null || string.IsNullOrEmpty(comment.User) || string.IsNullOrEmpty(comment.Text))
            {
                return BadRequest("Invalid comment data.");
            }

            Comment result = await _movieRepository.AddCommentToMovieAsync(comment.User, movieId, comment.Text);

            if (result is not null)
            {
                return Ok(comment);
            }
            return NotFound("Movie not found.");
        }

        // PUT: api/movie/{movieId}/comment
        [HttpPut("{movieId}/comment")]
        public async Task<ActionResult<Comment>> EditComment(string movieId, [FromBody] Comment editComment)
        {
            if (editComment == null || string.IsNullOrEmpty(editComment.User) || string.IsNullOrEmpty(editComment.Text))
            {
                return BadRequest("Invalid edit comment data.");
            }

            Comment result = await _movieRepository.EditCommentAsync(movieId, editComment);

            if (result is not null)
            {
                return Ok(result);
            }
            return NotFound("Comment not found or you are not authorized to edit it.");
        }

        [HttpPost("{movieId}/rating")]
        public async Task<IActionResult> AddRating(string movieId, [FromBody] int ratingValue)
        {
            if (ratingValue < 1 || ratingValue > 11)
            {
                return BadRequest("Rating value must be between 1 and 5.");
            }

            var success = await _movieRepository.AddRatingToMovieAsync(movieId, ratingValue);

            if (success)
            {
                return NoContent();
            }
            return NotFound("Movie not found.");
        }


        [HttpPost("upload")]
        public async Task<ActionResult<MovieUploadResponse>> Upload([FromForm] IFormFile file)
        {
            string s3Url = await this._s3Service.UploadFileAsync(file);

            if (string.IsNullOrWhiteSpace(s3Url))
            {
                return Problem("Cannot Upload");
            }
            
            return Ok(new MovieUploadResponse()
            {
                S3Url = s3Url
            });

        }

    }
}