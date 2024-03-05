import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { LoginComponent } from './login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(private oAuthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId:
        '990058818713-t2rvgqmj64smgi2l5m15bpiuip0pbel8.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/customer/dashboard',
      scope: 'openid profile email',
    };

    this.oAuthService.configure(config);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oAuthService.initLoginFlow();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getProlife() {
    return this.oAuthService.getIdentityClaims();
  }
}
