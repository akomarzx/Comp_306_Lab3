using System.ComponentModel.DataAnnotations;

namespace Lab3_Ejeh_Ombao_
{
    public class UpdateMovie
    {
        [Key]
        public string MovieId { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Genre { get; set; }
        public string Director { get; set; }
        public string ReleaseDate { get; set; }
        public string Owner { get; set; }
    }
}
