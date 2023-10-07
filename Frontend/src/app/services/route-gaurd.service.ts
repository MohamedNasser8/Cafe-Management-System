import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwtDecode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGaurdService {

  constructor(public authService: AuthService,
    public router: Router,
    private snackbarService: SnackbarService) { }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = router.data
    expectedRoleArray = expectedRoleArray.expectedRole

    const token: any = localStorage.getItem('token')

    var tokenPayload: any
    try {
      tokenPayload = jwtDecode(token)
    }
    catch (err) {
      localStorage.clear()
      this.router.navigate(['/'])
    }

    let expectedRole = ''

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        expectedRole = expectedRoleArray[i]
      }
    }

    if (tokenPayload.role == "user" || tokenPayload.role == "admin") {
      if (this.authService.isAuthenticated() && tokenPayload.role == expectedRole) {
        return true
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthorizedMessage, GlobalConstants.error)
      this.router.navigate(['/cafe/dashboard'])
      return false
    }
    else {
      this.router.navigate(['/'])
      localStorage.clear()
      return false
    }

  }
}
