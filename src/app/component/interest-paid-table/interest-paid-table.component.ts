import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { ValueTransformer } from '@angular/compiler/src/util';
import { DataSource } from '@angular/cdk/collections';


export interface PeriodicElement {
  accountNumber: string,
  transactionDate: string,
  narration: string,
  interestPaid: string
}

@Component({
  selector: 'app-interest-paid-table',
  templateUrl: './interest-paid-table.component.html',
  styleUrls: ['./interest-paid-table.component.scss']
})
export class InterestPaidTableComponent implements OnInit {
  dataSource: any;
  obj: any = [];
  constructor(public baseService: BaseService, private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public homeValue: {
      title: any;
      radioValue2: any;
    }) { }
  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }
  displayedColumns: string[] = ['accountNumber', 'transactionDate', 'narration', 'interestPaid'];

  getXmlDataForAccountsOnInit() {
    const headers = this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    this.baseService._makeRequest(Url.intPaidXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXMLHeads(res).then((parseData) => {
          this.dataSource = parseData;
          this.dataSource.forEach((data) => {
            if (data.interestPaid) {
              if (this.homeValue.radioValue2 == "Amount in Rupees") {
                data.interestPaid = (data.interestPaid);
              } else if (this.homeValue.radioValue2 == "Amount in Crores") {
                data.interestPaid = ((data.interestPaid) / 10000000);
              }
            }
          });

        });
      });
  }
  parseXMLHeads(data) {
    const T = [];
    return new Promise(resolve => {
      var parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].IntPaid;
        obj.forEach(element => {
          Object.keys(element).forEach(ele=>{
            if(ele=='ACCT_NUM'){
              let encryptedBase64Key="YWJjYWJjZGVmZGVmZ2hpZw==";
              let parsedBase64Key=CryptoJS.enc.Base64.parse(encryptedBase64Key);
              let decryptedData = CryptoJS.AES.decrypt( element[ele][0], parsedBase64Key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
                } );
              element[ele]=decryptedData.toString(CryptoJS.enc.Utf8);
            }else{
            element[ele] = element[ele][0];
            }
          })         
          });
        Object.values(obj).forEach((data: { ACCT_NUM: string[], VALUE_DATE: string[], NARRATION: string[], INT_AMOUNT: string[] }) => {
          T.push({
            accountNumber: data.ACCT_NUM,
            transactionDate: data.VALUE_DATE,
            narration: data.NARRATION,
            interestPaid: data.INT_AMOUNT
          })
        });
        resolve(T);

      });
    }
    )
  };
}