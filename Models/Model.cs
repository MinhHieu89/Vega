using System.ComponentModel.DataAnnotations;

namespace Vega.Models
{
    public class Model
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
        public int MakeId { get; set; }
        public Make Make { get; set; }
    }
}