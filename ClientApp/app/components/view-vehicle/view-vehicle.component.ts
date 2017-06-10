import { PhotoService } from './../../services/photo.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private vehicleService: VehicleService) {
    this.route.params.subscribe(p => this.vehicleId = +p['id']);
    if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
      this.router.navigate(['/vehicles']);
      return;
    }
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehicleId).subscribe(vehicle => this.vehicle = vehicle,
      err => {
        this.router.navigate(['/vehicles']);
        return;
      })
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.deleteVehicle(this.vehicleId).subscribe(res => {
        this.router.navigate(['/vehicles']);
      })
    }
  }

  uploadPhoto() {
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    this.photoService.upload(this.vehicleId, nativeElement.files[0]).subscribe(res => {
      console.log(res);
    })
  }

}
