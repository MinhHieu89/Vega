using System.Linq;
using AutoMapper;
using Vega.Controllers.Resources;
using Vega.Models;

namespace Vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping from domain models to api resources
            CreateMap<Photo, PhotoResource>();
            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<Make, MakeResource>();
            CreateMap<Make, KeyValuePairResource>();
            CreateMap<Model, KeyValuePairResource>();
            CreateMap<Feature, KeyValuePairResource>();
            CreateMap<Vehicle, VehicleResource>()
            .ForMember(vr => vr.Contact, opts => opts.MapFrom(v => new ContactResource { Name = v.ContactName, Phone = v.ContactPhone, Email = v.ContactEmail }))
            .ForMember(vr => vr.Features, opts => opts.MapFrom(v => v.Features.Select(vf => vf.Feature)))
            .ForMember(vr => vr.Make, opts => opts.MapFrom(v => v.Model.Make));

            // Mapping from api resources to domain models
            CreateMap<VehicleQueryResource, VehicleQuery>();
            CreateMap<SaveVehicleResource, Vehicle>()
            .ForMember(v => v.Id, opts => opts.Ignore())
            .ForMember(v => v.ContactName, opts => opts.MapFrom(vr => vr.Contact.Name))
            .ForMember(v => v.ContactPhone, opts => opts.MapFrom(vr => vr.Contact.Phone))
            .ForMember(v => v.ContactEmail, opts => opts.MapFrom(vr => vr.Contact.Email))
            .ForMember(v => v.Features, opts => opts.Ignore())
            .AfterMap((vr, v) =>
            {
                var addedFeatures = vr.Features.Where(id => !v.Features.Any(vf => vf.FeatureId == id)).Select(id => new VehicleFeature { FeatureId = id }).ToList();
                foreach (var f in addedFeatures)
                    v.Features.Add(f);

                var removedFeatures = v.Features.Where(vf => !vr.Features.Contains(vf.FeatureId)).ToList();
                foreach (var f in removedFeatures)
                    v.Features.Remove(f);
            });
        }
    }
}