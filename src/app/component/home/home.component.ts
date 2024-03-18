import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { PdfDownloadService } from 'src/app/services/pdf-download.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InterestPaidTableComponent } from 'src/app/component/interest-paid-table/interest-paid-table.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  accountParsedArr: any;
  homeParsedArr: any;
  dataSource: any;
  dataSources: any;
  radioValue1: string;
  radioValue2: string;
  radioSelectValue: string;
  constructor(
    public baseService: BaseService, public http: HttpClient, private pdfService: PdfDownloadService, public dialog: MatDialog
  ) {
    this.radioValue1 = "Account Number";
    this.radioValue2 = "Amount in Rupees";
  }

  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }

  displayedColumns: string[] = ['heads', 'amount'];
  displayedColumn: string[] = ['accounttype', 'totalcount'];



  onExcelDownload() {
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = this.baseService.getRansdomWithUser(false);

    let url = Url.homeDetailsDownload;
    localStorage.setItem('popUpManagement', 'true');

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.precisionType = this.radioValue2;

    this.baseService.downloadFile(url, body, "homeDetailsDownload.xls");

    localStorage.setItem('popUpManagement', 'false');
  }

  onRefreshClick() {
    this.getXmlDataForAccountsOnInit();
  }

  getXmlDataForAccountsOnInit() {
    const headers = this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    this.baseService._makeRequest(Url.homeXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXMLHeads(res).then((parseData) => {
          this.dataSource = parseData;
          let value = this.radioValue2;
          this.dataSource.forEach((data) => {
            if (data.amount) {
              if (value == "Amount in Rupees") {
                data.amount = (data.amount);
              } else {
                if (data.heads != "Limit Utilization (%)") {
                  data.amount = ((data.amount) / 10000000);
                }
              }
            }
          });
        });

        this.parseXMLAccountType(res).then((parseDatas) => {
          this.dataSources = parseDatas;
        });
      });
  }

  // parse the XML Heads table
  parseXMLHeads(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        let arra = [];
        let grantAmount = 0, utilizedAmt = 0;
        for (a in obj) {
          if (k == 'LimitGrantAmt') {
            grantAmount = obj[k][0];
          }
          if (k == 'UtilisedLimit') {
            utilizedAmt = obj[k][0];
          }
        }
        for (k in obj) {
          if (k == 'effAvailableAmt') {
            arra.push({ heads: 'Central Account Balance', amount: obj[k][0] })
          }
          if (k == 'LimitGrantAmt') {
            arra.push({ heads: 'Allocated Limits', amount: obj[k][0] })
          }
          if (k == 'UtilisedLimit') {
            arra.push({ heads: 'Utilized Limits', amount: obj[k][0] })
          }
          if (k == 'UnutilizedLimit') {
            arra.push({ heads: 'Un-Utilized Limit', amount: obj[k][0] })
          }
          if (k == 'LimitUtilization') {
            let value = obj[k][0];
            if (obj[k][0] == "No Records Found") {
              if (grantAmount == 0) {
                grantAmount = 1;
              }
              value = (utilizedAmt / grantAmount) * 100;
            }
            arra.push({ heads: 'Limit Utilization (%)', amount: value })
          }
          if (k == 'AccruedInterest') {
            let value = obj[k][0];
            if (obj[k][0] == "No Records Found") {
              value = 0;
            }
            arra.push({ heads: 'Quarter to Date-Accrued Interest', amount: value })
          }
          if (k == 'TotalInterestPaidInterest') {
            arra.push({ heads: 'Actual Interest Paid', amount: obj[k][0] })
          }
          if (k == 'PendingAdjustments') {
            arra.push({ heads: 'Pending Adjustments', amount: obj[k][0] })
          }
        }

        resolve(arra);
      });
    });
  }


  // parse the XML AccountType table
  parseXMLAccountType(data) {
    return new Promise(resolve => {
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          }); parser.parseString(data, function (err, result) {
            var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
            let accounttype = [];

            for (a in obj) {
              if (a == 'TotalCount') {
                accounttype.push({ accounttype: 'Number of Subsidiary Accounts', totalcount: obj[a][0] })
              }
            }

            resolve(accounttype);
          });
    });
  }

  onItemChange(value?: any) {
    this.getXmlDataForAccountsOnInit();

    this.radioSelectValue = value;

  }

  onPDFDownload() {
    this.pdfService.downloadPDF(this.content.nativeElement);
  }
  openDialogIntTable() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    dialogConfig.position = {
      top: '13vh',
      right: '20vw'
    };
    dialogConfig.data = {
      title: "Actual Interest Paid",
      radioValue2: !this.radioSelectValue ? this.radioValue2 : this.radioSelectValue
    }
    const dialogRef = this.dialog.open(InterestPaidTableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
