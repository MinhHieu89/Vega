using System.Threading.Tasks;
using Vega.Models;

namespace Vega.Persistence
{
    public interface IVehicleRepository
    {
        Task<Vehicle> GetVehicle(int id, bool includeRelated = true);
        Task AddAsync(Vehicle vehicle);
        void Remove(Vehicle vehicle);
    }
}