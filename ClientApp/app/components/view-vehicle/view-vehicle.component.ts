import { AuthService } from './../../services/auth.service';
import { BrowserXhr } from '@angular/http';
import { ProgressService, BrowserXhrWithProgress } from './../../services/progress.service';
import { ToastyService } from 'ng2-toasty';
import { NgZone } from '@angular/core';
import { PhotoService } from './../../services/photo.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css'],
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;
  photos: any[];
  progress: any;

  constructor(
    private auth: AuthService,
    private toastyService: ToastyService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private progressService: ProgressService,
    private photoService: PhotoService,
    private vehicleService: VehicleService) {
    this.route.params.subscribe(p => this.vehicleId = +p['id']);
    if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
      this.router.navigate(['/vehicles']);
      return;
    }
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId).subscribe(photos => this.photos = photos);

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
      });
    }
  }

  uploadPhoto() {
    this.progressService.startTracking().subscribe(progress => {
      console.log(progress);
      this.zone.run(() => {
        this.progress = progress;
      });
    },
      null,
      () => { this.progress = null; });

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files[0];
    nativeElement.value = '';

    this.photoService.upload(this.vehicleId, file).subscribe(photo => {
      this.photos.push(photo);
    }, err => {
      this.toastyService.error({
        title: 'ERROR',
        msg: err.text(),
        theme: 'bootstrap',
        showClose: true,
        timeout: 5000
      });
    });
  }

}
