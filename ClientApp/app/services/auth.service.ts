import { JwtHelper } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

    profile: any;
    private roles: string[] = [];    

    auth0 = new auth0.WebAuth({
        clientID: '2WeVUr4ogSAG0dtT91uANZEHlaHXCMq8',
        domain: 'minhhieu89.auth0.com',
        responseType: 'token id_token',
        audience: 'https://api.vega.com',   // This is just ..., not actual endpoint.
        redirectUri: 'http://localhost:5000/vehicles',
        scope: 'openid email profile'
    });


    constructor(public router: Router) { 
        // Get user info from local storage
        this.readUserInfoFromLocalStorage();
    }

    private readUserInfoFromLocalStorage() {
        this.profile = JSON.parse(localStorage.getItem('profile'));

        let token = localStorage.getItem('access_token');
        if (token) {
            let jwtHelper = new JwtHelper();
            let decodedToken = jwtHelper.decodeToken(token);
            this.roles = decodedToken['https://vega.com/roles'];
        }
    }

    public isInRole(role) {
        return this.roles.indexOf(role) > -1;
    }

    public login(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                
                window.location.hash = '';
                this.setSession(authResult);
                this.router.navigate(['/home']);

                // Log user info
                this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
                    if (err)
                        throw err; // This error will be handled by app.error-handler.ts
                    
                    localStorage.setItem('profile', JSON.stringify(profile));
                    this.readUserInfoFromLocalStorage();
                });
            } else if (err) {
                this.router.navigate(['/home']);
                console.log(err);
            }
        });
    }

    private setSession(authResult): void {
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    public logout(): void {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('profile');
        this.profile = null;
        this.roles = [];
        // Go back to the home route
        this.router.navigate(['/']);
    }

    public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

}
