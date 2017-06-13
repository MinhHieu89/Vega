import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { AuthGuard } from "./auth-gaurd.service";

@Injectable()
export class AdminAuthGuard extends AuthGuard {

    constructor(auth: AuthService) { 
        super(auth);
    }

    canActivate() {
        let isAuthenticated = super.canActivate();

        return isAuthenticated ? this.auth.isInRole('Admin') : false;
    }
}