using Amazon.DynamoDBv2.DataModel;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Lab3_Ejeh_Ombao_
{
    [DynamoDBTable("Movie")]
    public class Movie
    {
        [Key]
        [JsonProperty("movieId")]
        public string MovieId { get; set; } = Guid.NewGuid().ToString();
        
        [JsonProperty("title")]
        public string? Title { get; set; }

        [JsonProperty("summary")]
        public string? Summary { get; set; }

        [JsonProperty("genre")]
        public string? Genre { get; set; }
        
        [JsonProperty("director")]
        public string? Director { get; set; }
        
        [JsonProperty("releaseDate")]
        public string? ReleaseDate { get; set; }
        
        [JsonProperty("owner")]
        public string? Owner { get; set; }
        
        [JsonProperty("movieUrl")]
        public string? MovieUrl { get; set; }
        
        [JsonProperty("imageUrl")]
        public string? ImageUrl { get; set; }
        
        [JsonProperty("ratings")]
        public List<int>? Ratings { get; set; }
        
        [JsonProperty("comments")]
        public List<Comment> Comments { get; set; } 
    }

}
