import { VehicleService } from './../../services/vehicle.service';
import { Vehicle, SaveVehicle } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  makes: any[];
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id: 0,
    modelId: 0,
    makeId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  };

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(makes => this.makes = makes);
    this.vehicleService.getFeatures().subscribe(features => this.features = features);
  }

  onMakeChange() {
    let selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
    delete this.vehicle.modelId;
  }

  onFeatureToggle(id, $event) {
    if ($event.target.checked) {
      this.vehicle.features.push(id);
    } else {
      let index = this.vehicle.features.indexOf(id);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    this.vehicleService.createVehicle(this.vehicle).subscribe(x => { console.log(x) });
  }

}
