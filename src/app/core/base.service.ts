import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsrfService } from './services/csrf/csrf.service';
import 'rxjs/add/operator/mergeMap';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { StateServiceService } from './services/state-service.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, protected csrfService: CsrfService, private stateService: StateServiceService) { }
  /**
 * Common request function with basic mapping.
 * @param url Request URL.
 * @param body Body of the request if any
 * @param options An optional extra information object as per the request method.
 * @param method Request method.
 */
  _makeRequest<T>(
    url: string,
    body?: any,
    method: HttpMethod = 'GET',
    options?: {
      skipMap?: boolean;
      responseType?: string;
      headers?: HttpHeaders;
      params?: HttpParams;
      observe?: 'body' | 'events' | 'response';
    }): Observable<T> {

    const http = this.http;
    const mapper = (res) => <T>res;
    let request;

    switch (method) {
      case 'POST': request = http.post(url, body, { headers: options.headers, responseType: 'text' });
        // case 'PUT':
        // case 'DELETE':
        //   const requestOptions = {
        //     responseType: options && options.responseType as any || 'json',
        //     headers: options && options.headers || new HttpHeaders(),
        //     params: options && options.params || null,
        //     observe: options && options.observe || 'body'
        //   };
        //   const args = (method === 'DELETE') ? [url, requestOptions] : [url, body, requestOptions];

        //   // if (!this.csrfService.csrfNonce) {
        //   //   request = this.csrfService.getNonce()
        //   //     .mergeMap(nonce => {
        //   //       requestOptions.headers = requestOptions.headers.set(this.csrfService.csrfHeaderName, nonce);
        //   //       this.csrfService.csrfNonce = nonce;
        //   //       return this._getHttpFn(method).apply(http, args);
        //   //     });
        //   // } else {
        //     // requestOptions.headers = requestOptions.headers.set(this.csrfService.csrfHeaderName, this.csrfService.csrfNonce);
        //     request = this._getHttpFn(method).apply(http, args);
        //   // }
        break;
      case 'GET': request = http.get(url, { headers: options.headers, params: options.params, responseType: "text" });
      default:
        request = http.get(url, { headers: options.headers, responseType: "text" });
    }

    return options && options.skipMap ? request : request.map(mapper);
  }

  _getHttpFn(method: HttpMethod) {
    const http = this.http;
    let fn = this.http.post;

    switch (method) {
      case 'POST':
        fn = http.post;
        break;
      case 'PUT':
        fn = http.put;
        break;
      case 'DELETE':
        fn = http.delete;
    }

    return fn;
  }

  // Random APLHANUMERIC string geneartion function
  randomStr() {
    return Math.random().toString(36).substr(2);
  }


  //formation datetype - 14-july-2020 (date/monthname/year)
  dateformatasperdaymonthyear(datevalue) {
    let month = [
      'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var finalvaluefordate = datevalue.getDate() + '-' + month[datevalue.getMonth()] + '-' + datevalue.getFullYear();
    return finalvaluefordate;
  }

  dateFormatDDMMYYY(datevalue) {
    var finalvaluedate = ((datevalue.getDate() < 10 ? "0" : "") + datevalue.getDate()) + '-' +
      (((datevalue.getMonth() + 1) < 10 ? "0" : "") + (datevalue.getMonth() + 1)) + '-' +
      datevalue.getFullYear();
    return finalvaluedate;
  }

  //formation datetype - 14-07-2020 (date/month/year)
  dateformatasperddmmyy(datevalue) {
    var finalvaluedate = datevalue.getDate() + '-' + (datevalue.getMonth() + 1) + '-' + datevalue.getFullYear();
    return finalvaluedate;
  }

  //formation datetype - 07-14-2020 (month/date/year)
  dateformataspermmddyy(datevalue) {
    var finaldatevalue = (datevalue.getMonth() + 1) + "/" + datevalue.getDate() + "/" + datevalue.getFullYear();
    return finaldatevalue;
  }

  //formation datetype - only month
  dateformataspermm(datevalue) {
    let month = [
      'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var finalvaluefordate = month[datevalue.getMonth()];
    return finalvaluefordate;
  }

  //formation datetype - selecetd month -1 = previous month from slected
  dateformatasperprevioousfromselectedmm(datevalue) {
    let month = [
      'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    datevalue = new Date().getMonth();
    if (datevalue == 0) {
      var finalvaluefordate = month[11];
    }
    else {
      var finalvaluefordate = month[datevalue - 1];
    }
    return finalvaluefordate;
  }

  //formation datetype - selecetd year for cala
  dateformatasperprevioousfromselectedyy(datevalue) {
    let month = [
      'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    datevalue = new Date().getFullYear();
    var finalvaluefordate = datevalue.toString();
    return finalvaluefordate;
  }
  //formation datetype - selecetd month for cala as Jan 
  // dateformatasperpreviousmonasJan(datevalue) {
  //   let month = [
  //       'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //     ];
  //     datevalue = new Date().getMonth();
  //     var finalvaluefordate = month[datevalue];
  //     if(finalvaluefordate =='Jan')
  //     {
  //        var finalvalueformonthasJan = month[11];

  //     }

  //   return finalvalueformonthasJan;
  // }

  //formation datetype - selecet year for  month for cala as Jan 
  dateformatasperpreviousyearasJan(datevalue) {
    let month = [
      'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    datevalue = new Date().getFullYear();
    var finalvaluefordate = [datevalue - 1].toString();


    return finalvaluefordate;
  }

  //formation datetype - only year
  dateformatasperyy(datevalue) {
    var finalyearvalue = datevalue.getFullYear();
    return finalyearvalue.toString();
  }

  //formation datetype - month and year (07/2020)
  dateformataspermmyy(datevalue) {
    var finalmonyearvalue = (datevalue.getMonth() + 1) + "/" + datevalue.getFullYear();
    return finalmonyearvalue;
  }

  //togetlastdayofmonth 
  forlastdateofmonth(datevalue) {
    var lastdateofmonth = new Date(datevalue.getFullYear(), datevalue.getMonth() + 1, 0);
    return lastdateofmonth;
  }

  //to get date formation as = 07-01-2020 TO 07-11-2020
  togetfromdatevalueTOtodatevalue(datevalue, lastdayofmonthvalue) {
    var fromtotodatevalue = (datevalue.getMonth() + 1) + "-" + "1-" + datevalue.getFullYear() + ' TO ' + (lastdayofmonthvalue.getMonth() + 1) + "-" + lastdayofmonthvalue.getDate() + "-" + lastdayofmonthvalue.getFullYear();
    return fromtotodatevalue;
  }
  //For Headers
  getHeaders() {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'must-revalidate, no-cache, no-store',
      'Content-Security-Policy': "default-src 'self'",
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
    });
    return headers;
  }

  getRansdomWithUser(isUserReq) {
    var requestUUID = `SS09_${this.randomStr()}`;
    if (isUserReq) {
      let intiateUser = "_###" + ((this.stateService.data && this.stateService.data[0]) ? this.stateService.data[0].UserID : "AxisUser");
      requestUUID = requestUUID + intiateUser;
    }
    return requestUUID;
  }

  geDownloadtHeaders() {

    var headers = new HttpHeaders({
      'Content-Type': 'application/vnd.ms-excel',
      'Cache-Control': 'must-revalidate, no-cache, no-store',
      'Content-Security-Policy': "default-src 'self'",
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
    });
    return headers;
  }

  downloadFile(url, params, fileName) {
    const headers = this.geDownloadtHeaders();
    this.http.get(url, { headers: headers, params: params, responseType: "blob" as "blob" }).subscribe(
      (response) => {
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }));
        // supply your own fileName here...
        a.download = fileName;
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)
      });
  }
  encryptionFunction(plainText:any)
  {
    let encryptedBase64Key="YWJjYWJjZGVmZGVmZ2hpZw==";
    let parsedBase64Key=CryptoJS.enc.Base64.parse(encryptedBase64Key);
    let encryptedData;
    encryptedData=CryptoJS.AES.encrypt(plainText,parsedBase64Key,{
      keySize: 16,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
      });
     return encryptedData.toString();
  }
  encryptionFunctionObject(plainText:any){
    let encryptedBase64Key="YWJjYWJjZGVmZGVmZ2hpZw==";
    let parsedBase64Key=CryptoJS.enc.Base64.parse(encryptedBase64Key);
    let encryptedData;
    encryptedData=CryptoJS.AES.encrypt(JSON.stringify(plainText),parsedBase64Key,{
      keySize: 16,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
      });
     return encryptedData.toString();
  }
  
  dencryptionFunction(plainText:any){
    let encryptedBase64Key = 'YWJjYWJjZGVmZGVmZ2hpZw==';
    let parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);
    let dencryptedData;
       dencryptedData = CryptoJS.AES.decrypt(plainText,parsedBase64Key,
      {
        keySize: 16,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);
     
    return dencryptedData;
  }

}
