import { Component, OnInit, Inject } from '@angular/core';
import xml2js from 'xml2js';
import * as _ from 'lodash'; 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-limitlewdger',
  templateUrl: './limitlewdger.component.html',
  styleUrls: ['./limitlewdger.component.scss']
})
export class LimitlewdgerComponent implements OnInit {
  dataSource:any;
  totalCount:any;
  actNumber:any;
  isLoading = true;


  constructor(public baseService: BaseService, public http: HttpClient,@Inject(MAT_DIALOG_DATA) data) {
    this.actNumber = data.actNumber;
  }

  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }

  onExcelDownload(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);
    let date = new Date();
    let fromDate = this.baseService.dateformatasperdaymonthyear(date);
    let toDate = this.baseService.dateformatasperdaymonthyear(date);
    let acctNo = this.actNumber;

    let url = Url.accountDetailsInfoDownload;
    localStorage.setItem('popUpManagement', 'true');
    
    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.acctFromDate = fromDate.toString();
    body.acctToDate = toDate.toString();
    body.acctId = acctNo ? (acctNo).toString() : "";
    body.precisionType = "Amount in Rupees";
    this.baseService.downloadFile(url,body,"accountDetailsInfo.xls");

    localStorage.setItem('popUpManagement', 'false');
  }

  private getXmlDataForAccountsOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let date = new Date();
    body.FromDate = this.baseService.dateformatasperdaymonthyear(date);
    body.ToDate = this.baseService.dateformatasperdaymonthyear(date);
    body.AcctNo = this.actNumber;

    this.baseService._makeRequest(Url.accounthyperlinkAccountNoXmlUrl, 
      this.baseService.encryptionFunctionObject(body),
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(this.baseService.dencryptionFunction(res)).then((parseData) => {
        this.dataSource = parseData[0];

        this.dataSource.data = this.dataSource;
        this.totalCount = parseData[1];
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
      });
    }, (error) => {
      this.isLoading = false;
    });
  }

  // parse the XML data
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].AccountInquiry[0].AcctDtls;
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
           arra.push(element);
        });
        let resolvedArr = [arra]
        resolve(resolvedArr);
      });
    });
  }
    
  displayedColumns: string[] = ['no','dateoflimit','limitgrant','limitresanction','limitremoval','limitutilized','balancelimit'];
}