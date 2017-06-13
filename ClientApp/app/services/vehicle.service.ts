import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SaveVehicle } from "../models/vehicle";
import { AuthHttp } from "angular2-jwt";

@Injectable()
export class VehicleService {

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getMakes() {
    return this.http.get('/api/makes').map(res => res.json());
  }

  getFeatures() {
    return this.http.get('/api/features').map(res => res.json());
  }

  createVehicle(vehicle: SaveVehicle) {
    return this.authHttp.post('/api/vehicles', vehicle).map(res => res.json());
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.authHttp.put('/api/vehicles/' + vehicle.id, vehicle).map(res => res.json());
  }

  deleteVehicle(id: number) {
    return this.authHttp.delete('/api/vehicles/' + id).map(res => res.json());
  }

  getVehicle(id: number) {
    return this.http.get('/api/vehicles/' + id).map(res => res.json());
  }

  getVehicles(filter) {
    return this.http.get('/api/vehicles' + '?' + this.toQueryString(filter)).map(res => res.json());
  }

  private toQueryString(obj) {
    let parts = [];

    for (let property in obj) {
      let value = obj[property];
      if (value != null && value != undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }
}
