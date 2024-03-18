import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import xml2js from 'xml2js';
import * as _ from 'lodash'; 
import { MatSnackBar } from '@angular/material';

interface UserTypes {
  value: string;
  viewValue: string;
}

interface UserLevels {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-useraccount',
  templateUrl: './useraccount.component.html',
  styleUrls: ['./useraccount.component.scss']
})

export class UseraccountComponent implements OnInit {
  userAccountFormGroup: FormGroup;
  adressDefault:any = "NA";
  constructor(private _snackBar: MatSnackBar,private fb: FormBuilder,public baseService: BaseService, public http: HttpClient) { }

  ngOnInit() {
    this.userAccountFormGroup = this.fb.group({
      userType: new FormControl('', Validators.required),
      userLevel: new FormControl('', Validators.required),
      zone: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      regions: new FormControl('', Validators.required),
      pds: new FormControl('', Validators.required),
      calas: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]),
      address: new FormControl('', Validators.required),
    });
    
    this.userAccountFormGroup.controls.userLevel.disable();
    this.userAccountFormGroup.controls.zone.disable();
    this.userAccountFormGroup.controls.state.disable();
    this.userAccountFormGroup.controls.regions.disable();
    this.userAccountFormGroup.controls.pds.disable();
    this.userAccountFormGroup.controls.calas.disable();

    this.getZoneData();
    
  }

  usertypes: UserTypes[] = [
    { value: 'axis-0', viewValue: 'Axis' },
    { value: 'nhai-1', viewValue: 'NHAI' }
  ];

  userlevels: UserLevels[] = [
    { value: 'head-0', viewValue: 'Head Office' },
    { value: 'zone-1', viewValue: 'Zone' },
    { value: 'state-2', viewValue: 'State' },
    { value: 'region-3', viewValue: 'Regional Office' },
    { value: 'pd-4', viewValue: 'Project Directors' },
    { value: 'cala-5', viewValue: 'CALA' },
  ];

  zones = new FormControl();
  zoneList: string[] = ['East', 'West', 'North', 'South'];

  states = new FormControl();
  stateList: string[] = ['Andrapradesh', 'Telangana', 'Mumbai', 'Chennai'];  

  regions = new FormControl();
  regionList: string[] = ['Region1', 'Region2', 'Region3', 'Region4'];

  pds = new FormControl();
  pdList: string[] = ['PD1', 'PD2', 'PD3', 'PD4'];

  onUserTypeChange(userType: any) {
    // If Axis user type, disable all feilds
    if (userType == this.usertypes[1].value) {
      this.userAccountFormGroup.controls.userLevel.enable();
    } else {      
      this.userAccountFormGroup.controls.userLevel.disable();
      this.userAccountFormGroup.controls.zone.disable();
      this.userAccountFormGroup.controls.state.disable();
      this.userAccountFormGroup.controls.regions.disable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.disable();
    }
    this.userAccountFormGroup.controls.userLevel.reset();
    this.userAccountFormGroup.controls.zone.reset();
    this.userAccountFormGroup.controls.state.reset();
    this.userAccountFormGroup.controls.regions.reset();
    this.userAccountFormGroup.controls.pds.reset();
    this.userAccountFormGroup.controls.calas.reset();
  }

  onUserLevelChange(userLevel: any) {
    if (userLevel == this.userlevels[0].value) {
      this.userAccountFormGroup.controls.zone.disable();
      this.userAccountFormGroup.controls.state.disable();
      this.userAccountFormGroup.controls.regions.disable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.disable();
    } else {
      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.state.enable();
      this.userAccountFormGroup.controls.regions.enable();
      this.userAccountFormGroup.controls.pds.enable();
      this.userAccountFormGroup.controls.calas.enable();
    }
    if (userLevel == this.userlevels[1].value) {

      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.state.disable();
      this.userAccountFormGroup.controls.regions.disable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.disable();

      this.userAccountFormGroup.controls.state.reset();
      this.userAccountFormGroup.controls.regions.reset();
      this.userAccountFormGroup.controls.pds.reset();
      this.userAccountFormGroup.controls.calas.reset();
    }
    if (userLevel == this.userlevels[2].value) {
      this.userAccountFormGroup.controls.state.enable();
      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.regions.disable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.disable();

      this.userAccountFormGroup.controls.regions.reset();
      this.userAccountFormGroup.controls.pds.reset();
      this.userAccountFormGroup.controls.calas.reset();
    }
    if (userLevel == this.userlevels[3].value) {
      this.userAccountFormGroup.controls.state.enable();
      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.regions.enable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.disable();

      this.userAccountFormGroup.controls.pds.reset();
      this.userAccountFormGroup.controls.calas.reset();
    }
    if (userLevel == this.userlevels[4].value) {
      this.userAccountFormGroup.controls.state.enable();
      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.regions.enable();
      this.userAccountFormGroup.controls.pds.enable();
      this.userAccountFormGroup.controls.calas.disable();

      this.userAccountFormGroup.controls.calas.reset();
    }
    if (userLevel == this.userlevels[5].value) {
      this.userAccountFormGroup.controls.state.enable();
      this.userAccountFormGroup.controls.zone.enable();
      this.userAccountFormGroup.controls.regions.enable();
      this.userAccountFormGroup.controls.pds.disable();
      this.userAccountFormGroup.controls.calas.enable();

      this.userAccountFormGroup.controls.pds.reset();
    }
  }
  btnCancel() {
    this.userAccountFormGroup.reset();
  }

  submit() {
    if (this.userAccountFormGroup.valid) {
      let body: any  = {};
      let mobileval = "";
      for (let field in this.userAccountFormGroup.controls) {
        let fieldVal = this.userAccountFormGroup.controls[field].value;
        if(field == "userType"){
          body.usertype = fieldVal ? fieldVal : "";
        }else if(field == "userLevel"){
          body.userlevel = fieldVal ? fieldVal : "";
        }else if(field == "zone"){
          body.zone = fieldVal ? fieldVal : "";
        }else if(field == "state"){
          body.state = fieldVal ? fieldVal : "";
        }else if(field == "regions"){
          body.regions = fieldVal ? fieldVal : "";
        }else if(field == "pds"){
          body.pds = fieldVal ? fieldVal : "";
        }else if(field == "calas"){
          body.calas = fieldVal ? fieldVal : "";
        }else if(field == "firstname"){
          body.firstname = fieldVal ? fieldVal : "";
        }else if(field == "lastname"){
          body.lastname = fieldVal ? fieldVal : "";
        }else if(field == "mobile"){
         mobileval = fieldVal ? fieldVal : "";
        }else if(field == "email"){
          body.email = fieldVal ? fieldVal : "";
        }else if(field == "address"){
          body.address = fieldVal ? fieldVal : "";
        }
      }

      body.createddate = new Date().toISOString();
      body.updateddate = new Date().toISOString();
      body.userid = "";
      body.password = "";
      body.requestuuid = this.baseService.getRansdomWithUser(true);
      body.phonenumber = mobileval;

      const headers =this.baseService.getHeaders();
      
      this.baseService._makeRequest(Url.saveUserInfo,
        body,
        'POST', {
        responseType: 'application/text',
        headers: headers
      }).subscribe((res:string) => {
        if(res == 'Success'){
          this._snackBar.open("Mail with login username and password sent to given email", "", {
            duration: 2000,
          });
          this.userAccountFormGroup.reset();
        }else if(res == 'PhoneNumberExists'){
          this._snackBar.open("Phone number already exists within the system", "", {
            duration: 2000,
          });
        }else if(res == 'EmailExists'){
          this._snackBar.open("Email already exists within the system", "", {
            duration: 2000,
          });
        }else {
          this._snackBar.open("User details save failed", "", {
            duration: 2000,
          });
        }
      });
    }
  }

  onlyNumberKey(event){
    return (event.charCode === 8 || event.charCode === 0) ? null: event.charCode >= 48 && event.charCode <= 57;
  }

  private getZoneData() {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    this.baseService._makeRequest(Url.userZone, 
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseZoneAndStateXML(res).then((parseData:string[]) => {
        this.zoneList = parseData;
      });
    });
  }

  onZoneChange(zoneVal){
    this.getSateData(zoneVal);
  }

  private getSateData(zoneVal:any) {
    if(zoneVal == undefined || zoneVal == ""){
      return;
    }

    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;    
    body.zone_ID = zoneVal;

    this.baseService._makeRequest(Url.userState, 
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseZoneAndStateXML(res).then((parseData:string[]) => {
        this.stateList = parseData;
      });
    });
  }

  onStateChange(stateVal){
    this.getRegionalOfficeData(stateVal);
  }

  parseZoneAndStateXML(data) {
    return new Promise(resolve => {
      var k: string | number,
          parser = new xml2js.Parser({
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Records;
        let arra = [];

        arr.forEach(element => {
          for (k in element) {
            arra.push(element[k][0]);
          }
        });
        resolve(arra);
      });
    });
  }

  private getRegionalOfficeData(stateVal:any) {
    if(stateVal == undefined || stateVal == ""){
      return;
    }

    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;    
    body.state = stateVal;

    this.baseService._makeRequest(Url.userRo,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData: string[]) => {
        this.regionList = parseData;
      });
    });
  }

  onRegionalOfficeChange(regionalOffice:string){
    if(regionalOffice == undefined || regionalOffice == ""){
      return;
    }

    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime; 
    let index = regionalOffice.indexOf('-(');
    body.ro_name = regionalOffice.substring(0,index);

    this.baseService._makeRequest(Url.userPD,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData: string[]) => {
        this.pdList = parseData;
      });
    });
  }

  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number,
          parser = new xml2js.Parser({
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Records;
        let arra = [];

        arr.forEach(element => {
          let finalval = "";
          for (k in element) {
            if(finalval != ""){
              finalval = finalval+"-("+element[k][0]+")";
            }else{
              finalval = finalval+element[k][0];
            }
          }
          arra.push(finalval);
        });
        resolve(arra);
      });
    });
  }

  onCALABlur(calaActValue:string){
    if(calaActValue == undefined){
      return;
    }
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime; 
    body.acct_id = calaActValue.toString();

    this.baseService._makeRequest(Url.userCALA,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseCALAXML(res).then((parseData: string[]) => {
       let status = parseData[0];
       if(status.toUpperCase() != "TRUE" ){
          this._snackBar.open("CALA Account is not matching on the system", "", {
            duration: 4000,
          });
          this.userAccountFormGroup.controls.calas.reset();
       }
      });
    });
  }

  parseCALAXML(data){
    return new Promise(resolve => {
      var parser = new xml2js.Parser({
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].status;
        let arra = [];
        if(arr){
          arr.forEach(element => {
            arra.push(element);
          });
        }
        resolve(arra);
      });
    });
  }

}
