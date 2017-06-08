import * as _ from 'underscore';
import { VehicleService } from './../../services/vehicle.service';
import { Vehicle, SaveVehicle } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import 'rxjs/add/observable/forkJoin';
import { Observable } from "rxjs/Observable";

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService) {
      this.route.params.subscribe(p => this.vehicle.id = +p['id'] || 0);
    }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if (this.vehicle.id) {
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    }

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];

      if (this.vehicle.id) {
        this.mapVehicle(data[2]);
        this.populateModel();
      }
    }, err => {
      this.router.navigate(['/home']);
    });
  }

  mapVehicle(v : Vehicle) {
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.contact = v.contact;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange() {
    this.populateModel();
    delete this.vehicle.modelId;
  }

  populateModel() {
    let selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
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
    if (this.vehicle.id) {
      this.vehicleService.updateVehicle(this.vehicle).subscribe(res => {
        this.router.navigate(['/home']);
      })
    } else {
      this.vehicleService.createVehicle(this.vehicle).subscribe(res => {
        this.router.navigate(['/home']);
      });
    }
  }

}
