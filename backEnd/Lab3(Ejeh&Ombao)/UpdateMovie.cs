using System.ComponentModel.DataAnnotations;

namespace Lab3_Ejeh_Ombao_
{
    public class UpdateMovie
    {
        public string? Title { get; set; }
        public string? Summary { get; set; }
        public string? Genre { get; set; }
        public string? Director { get; set; }
        public string? ReleaseDate { get; set; }
    }
}
