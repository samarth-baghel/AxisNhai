import { Injectable } from '@angular/core';
import { JwtService } from '../jwt/jwt.service';
import { Router } from '@angular/router';
import { StateServiceService } from '../state-service.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { BaseService } from '../../base.service';
import { Url } from 'src/app/core/services/url';
import { MatDialog } from '@angular/material';
import { ForgetpasswordComponent } from 'src/app/component/forgetpassword/forgetpassword.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private jwtService: JwtService, private router: Router,
    private statesService: StateServiceService, private baseService: BaseService,private dialog:MatDialog) { }

  logout() {
    this.jwtService.destroyTokens();
    this.sendLogoutInfo();
    this.router.navigateByUrl('/login');
  }
  
  logoutFromErrorPage() {
    console.log("akjdbskjfdjk")
      this.jwtService.destroyTokens();
      console.log("uweiywuiyu")
      this.sendLogoutInfo();
  }

  sendLogoutInfo() {
    console.log("shdgshgdjgskhd")
    let userData = this.statesService.data;
    if(userData != undefined && userData != null){
      if (userData.length > 0) {
        let userID = userData[0].UserID;
        let body: any = {};
        body.logout = (userID).toString();
  
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET,POST',
          'Cache-Control': 'no-cache,no-store,must-revalidate',
          'Content-Security-Policy': "default-src 'self'",
          'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
        });
  
        this.baseService._makeRequest(Url.logout,
          body,
          'POST', {
          responseType: 'text',
          headers: headers
        }).subscribe((res: string) => {
        });
      }
    }
  }
  changePassword(dialogConfig){
    const dialogRef = this.dialog.open(ForgetpasswordComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
