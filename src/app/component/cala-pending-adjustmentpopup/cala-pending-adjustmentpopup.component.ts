import { Component, OnInit,Inject } from '@angular/core';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-cala-pending-adjustmentpopup',
  templateUrl: './cala-pending-adjustmentpopup.component.html',
  styleUrls: ['./cala-pending-adjustmentpopup.component.scss']
})
export class CalaPendingAdjustmentpopupComponent implements OnInit {
  dataSource: any;
  ReconMonthdata :any;
  AccountNumberdata:any;
  ReconMonth :any;
  ReconYear :any;
  displayedColumns: string[] = ['no','accountno', 'holdername', 'opendate', 'month', 'debitcredit','transparticulars','amount'];
  constructor(public baseService: BaseService, public http: HttpClient, @Inject(MAT_DIALOG_DATA) data) {
    this.AccountNumberdata = data.actNumber;
    this.ReconMonthdata = data.Reconvalue;
    this.ReconMonth = this.baseService.dateformataspermm(this.ReconMonthdata);
    this.ReconYear = this.baseService.dateformatasperyy(this.ReconMonthdata);
   }

  ngOnInit() {
    this.getxmldataforpendingadjustment();
  }

  private getxmldataforpendingadjustment(){
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.accNo = this.AccountNumberdata;
    body.month = this.ReconMonth;
    body.year = this.ReconYear;
    this.baseService._makeRequest(Url.calapendingadjustmentXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.dataSource = parseData[0];
        this.dataSource = this.dataSource.filter((data) => { return (data['no'] != undefined); });
      });
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
      var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
     // let totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt;
      for (k in obj) {
        const id = k.split(/([0-9]+)/)[1];
        const item = k.split(/([0-9]+)/).filter(Boolean)[0].slice(0, -1);
        if (itemArr.length > 0) {
          const index = _.findIndex(itemArr, { no: id });
          if (index == -1) {
            itemArr.push({ [`${item}`]: obj[k][0], no: id });
          } else {
            if ((item == "ACCT_OPN_DATE") || (item == "LAST_TRAN_DATE")) {
              if ((obj[k][0]) == "NA") {
                obj[k][0] = "--"
              }
            }
            itemArr[index][item] = obj[k][0]
          }
        }
        else {
          itemArr.push({ [`${item}`]: obj[k][0], no: id });
        }
      }
      let resolvedArr = [itemArr]
      resolve(resolvedArr);
    });
  });
}
  
}
