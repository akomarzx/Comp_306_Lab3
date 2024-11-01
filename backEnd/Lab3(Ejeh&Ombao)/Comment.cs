using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Lab3_Ejeh_Ombao_
{
    public class Comment
    {
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string Id { get; set; } 
        
        [JsonProperty("username")]
        [JsonPropertyName("username")]
        public string? User { get; set; } 
        
        [JsonProperty("content")]
        [JsonPropertyName("content")]
        public string? Text { get; set; } 
        
        [JsonProperty("timestamp")]
        [JsonPropertyName("timestamp")]
        public DateTime? CreatedAt { get; set; }
    }
}
