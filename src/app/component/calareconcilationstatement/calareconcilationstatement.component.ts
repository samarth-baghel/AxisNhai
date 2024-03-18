import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { from, Observable } from 'rxjs';
import { CalaPendingAdjustmentpopupComponent } from '../cala-pending-adjustmentpopup/cala-pending-adjustmentpopup.component';
import { startWith, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AutocompleteDisplayComponent } from '../autocomplete-display/autocomplete-display.component';

@Component({
  selector: 'app-calareconcilationstatement',
  templateUrl: './calareconcilationstatement.component.html',
  styleUrls: ['./calareconcilationstatement.component.scss'],
})

export class CalareconcilationstatementComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  dataSourcecala: any;
  pageSize: any;
  fromCount = 1;
  toCount = 10;
  radioValue2: string;
  totalCount: any;
  fromdate: any;
  todate: any;
  accfromCount: any = 1;
  acctoCount: any = 10;
  accountnumber: any = "";
  dataSourcecalaacc: any;
  accpageSize: any = 10;
  totalCountAcc: any;
  accNo: any;
  monthdate: any;
  selectedMonth: Date;
  filteredvalue: any[];
  @Input() myControl: any;
  @ViewChild(AutocompleteDisplayComponent, { static: false })
  private drpValue: AutocompleteDisplayComponent;
  accNumber: any;
  dataSourcecaladrp: any;

  constructor(public baseService: BaseService, public dialog: MatDialog, private _formBuilder: FormBuilder) {
    this.radioValue2 = "Amount in Rupees";
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getxmldataforCALAOnInit();
    this.getDropdownData();
  }

  openDialogPendingadjustment(accountNumber?: any, roconmonthvalue?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      actNumber: accountNumber,
      Reconvalue: roconmonthvalue
    }
    const dialogRef = this.dialog.open(CalaPendingAdjustmentpopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onItemChange(value?: any) {
    this.getxmldataforCALAOnInit();
  }
  onSearchclick() {
    this.getxmldataforCALAOnInit();
  }
  onSearchclicks() {
    this.accNumber = this.drpValue.myControl.value;
    this.getxmldataforCALAOnInit();
  }
  pageEvent(event) {
    this.fromCount = (event.pageIndex * event.pageSize) + 1;
    this.toCount = (event.pageIndex + 1) * event.pageSize;
    this.getxmldataforCALAOnInit();
  }
  pageEventForAcc(event) {
    this.accfromCount = (event.pageIndex * event.pageSize) + 1;
    this.acctoCount = (event.pageIndex + 1) * event.pageSize;
    this.getxmldataforCALAOnInit();
  }

  displayedColumns: string[] = ['no', 'accountnumber', 'accountname', 'totalsanctionedlimits', 'limitsutilizedperprevyear', 'limitsutilizedincurryear', 'unutilizedlimit', 'electtrf', 'tdstrf', 'otherdrtrf', 'returns', 'dddebit', 'clearingdebit', 'lessfundscrbcktoacctmiss', 'lessoutwardchequereturn', 'othercreditdepsits'];
  displayedColumn: string[] = ['accountnumber', 'accountname', 'reconformonthyear', 'openingbalance', 'limitgrant', 'limitutilized', 'closingbalance', 'pendingadjustment'];

  private getxmldataforCALAOnInit() {
    this.getAccountData();
    this.getFirstTableData();
    // this.getDropdownData();
  }

  getFirstTableData() {
    const headers = this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);

    let fromDate = this.fromdate;
    let toDate = this.todate;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let finalVal = '';
    if (fromDate) {
      finalVal = this.baseService.dateformatasperddmmyy(fromDate);
    }

    let finalValforodate = '';
    if (toDate) {
      finalValforodate = this.baseService.dateformatasperddmmyy(toDate);
    }

    let actnumber = ""
    if (this.accountnumber != undefined && this.accountnumber != null) {
      actnumber = this.accountnumber;
    }
    body.acctId = actnumber.toString();
    body.from_date = finalVal;
    body.to_date = finalValforodate;
    body.RecFromNum = (this.fromCount).toString();
    body.RecToNum = (this.toCount).toString();

    this.baseService._makeRequest(Url.calareconsilation,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    })
      .subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.dataSourcecala = parseData[0];
          this.totalCount = parseData[1];
          //this.dataSource.data = this.dataSourcecala;
          let value = this.radioValue2;
          this.dataSourcecala.forEach((data) => {
            if (data.AllocatedLimits) {
              if (value == "Amount in Rupees") {
                data.AllocatedLimits = (data.AllocatedLimits)
              } else {
                data.AllocatedLimits = ((data.AllocatedLimits) / 10000000)
              }
            }
            if (data.UtilizedLimitTillPrvMonth) {
              if (value == "Amount in Rupees") {
                data.UtilizedLimitTillPrvMonth = (data.UtilizedLimitTillPrvMonth)
              } else {
                data.UtilizedLimitTillPrvMonth = ((data.UtilizedLimitTillPrvMonth) / 10000000)
              }
            }
            if (data.UtilizedLimitInCurrMonth) {
              if (value == "Amount in Rupees") {
                data.UtilizedLimitInCurrMonth = (data.UtilizedLimitInCurrMonth)
              } else {
                data.UtilizedLimitInCurrMonth = ((data.UtilizedLimitInCurrMonth) / 10000000)
              }
            }
            if (data.PaidForTDS) {
              if (value == "Amount in Rupees") {
                data.PaidForTDS = (data.PaidForTDS)
              } else {
                data.PaidForTDS = ((data.PaidForTDS) / 10000000)
              }
            }
            if (data.OtherDebit) {
              if (value == "Amount in Rupees") {
                data.OtherDebit = (data.OtherDebit)
              } else {
                data.OtherDebit = ((data.OtherDebit) / 10000000)
              }
            }
            if (data.ElecTrf) {
              if (value == "Amount in Rupees") {
                data.ElecTrf = (data.ElecTrf)
              } else {
                data.ElecTrf = ((data.ElecTrf) / 10000000)
              }
            }
            if (data.Returns) {
              if (value == "Amount in Rupees") {
                data.Returns = (data.Returns)
              } else {
                data.Returns = ((data.Returns) / 10000000)
              }
            }
            if (data.DDdebit) {
              if (value == "Amount in Rupees") {
                data.DDdebit = (data.DDdebit)
              } else {
                data.DDdebit = ((data.DDdebit) / 10000000)
              }
            }
            if (data.ClearingDr) {
              if (value == "Amount in Rupees") {
                data.ClearingDr = (data.ClearingDr)
              } else {
                data.ClearingDr = ((data.ClearingDr) / 10000000)
              }
            }
            if (data.CrBkToAcct) {
              if (value == "Amount in Rupees") {
                data.CrBkToAcct = (data.CrBkToAcct)
              } else {
                data.CrBkToAcct = ((data.CrBkToAcct) / 10000000)
              }
            }
            if (data.OutChqRet) {
              if (value == "Amount in Rupees") {
                data.OutChqRet = (data.OutChqRet)
              } else {
                data.OutChqRet = ((data.OutChqRet) / 10000000)
              }
            }
            if (data.OtherCredit) {
              if (value == "Amount in Rupees") {
                data.OtherCredit = (data.OtherCredit)
              } else {
                data.OtherCredit = ((data.OtherCredit) / 10000000)
              }
            }
            if (data.UnUtilizedLimit) {
              if (value == "Amount in Rupees") {
                data.UnUtilizedLimit = (data.UnUtilizedLimit)
              } else {
                data.UnUtilizedLimit = ((data.UnUtilizedLimit) / 10000000)
              }
            }
          })
        })
      });
  }
  getAccountData() {
    const headers = this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);

    let monthdate = this.monthdate;

    let finalYearVal = '';
    let finalMonthVal = '';

    if (monthdate == '' || monthdate == undefined){
      finalMonthVal = this.baseService.dateformatasperprevioousfromselectedmm(monthdate);
      if(finalMonthVal== "Dec"){
        finalYearVal = this.baseService.dateformatasperpreviousyearasJan(monthdate);
      
      }
     else{
      finalYearVal = this.baseService.dateformatasperprevioousfromselectedyy(monthdate); 
     }
         
    }
    else if(monthdate){
      finalMonthVal = this.baseService.dateformataspermm(monthdate);
      finalYearVal = this.baseService.dateformatasperyy(monthdate);
    }

    // if (monthdate='Jan'){
    //   finalMonthVal = this.baseService.dateformatasperpreviousmonasJan(monthdate).toString();
    //   finalYearVal = this.baseService.dateformatasperpreviousyearasJan(monthdate);
    // }

    let actnumber = ""
    if (this.accNumber != undefined && this.accNumber != null) {
      actnumber = this.accNumber;
    }
    // For dropdown Account No.
    //let actnumber = this.accNumber;

    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.accNo = actnumber;
    body.month = finalMonthVal;
    body.year = finalYearVal;
    body.recFromNo = (this.accfromCount).toString();
    body.recToNo = (this.acctoCount).toString();

    this.baseService._makeRequest(Url.calareconsilationAccXmlUrl,
      this.baseService.encryptionFunctionObject(body),
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXMLAccount(this.baseService.dencryptionFunction(res)).then((parseDatas) => {
        this.dataSourcecalaacc = parseDatas[0];
        this.totalCountAcc = parseDatas[1];
        let value = this.radioValue2;
        this.dataSourcecalaacc.forEach((data) => {
          if (data.OpenBal) {
            if (value == "Amount in Rupees") {
              data.OpenBal = (data.OpenBal)
            } else {
              data.OpenBal = ((data.OpenBal) / 10000000)
            }
          }
          if (data.ALLOCATEDLIMITS) {
            if (value == "Amount in Rupees") {
              data.ALLOCATEDLIMITS = (data.ALLOCATEDLIMITS)
            } else {
              data.ALLOCATEDLIMITS = ((data.ALLOCATEDLIMITS) / 10000000)
            }
          }
          if (data.UTILISED_LIMIT) {
            if (value == "Amount in Rupees") {
              data.UTILISED_LIMIT = (data.UTILISED_LIMIT)
            } else {
              data.UTILISED_LIMIT = ((data.UTILISED_LIMIT) / 10000000)
            }
          }
          if (data.ClosingBal) {
            if (value == "Amount in Rupees") {
              data.ClosingBal = (data.ClosingBal)
            } else {
              data.ClosingBal = ((data.ClosingBal) / 10000000)
            }
          }
          if (data.pendingAdj) {
            if (value == "Amount in Rupees") {
              data.pendingAdj = (data.pendingAdj)
            } else {
              data.pendingAdj = ((data.pendingAdj) / 10000000)
            }
          }
        })
      })
    });
  }

  //For dropdown
  getDropdownData() {
    const headers = this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);

    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;

    this.baseService._makeRequest(Url.calareconsilationDropXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXMLDropdown(res).then((parseDatas) => {
        this.dataSourcecaladrp = parseDatas[0];
        this.dataSourcecaladrp = this.dataSourcecaladrp.filter((data) => { return (data['no'] != undefined); });
        this.dataSourcecaladrp = this.dataSourcecaladrp.map((data) => { return (data['AccountNumber']); });
      })
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
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].CALASummaryDtl[0];
        let totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt;
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
        let resolvedArr = [itemArr, totalCount]
        resolve(resolvedArr);
      });
    });
  }

  // parse the XML data
  parseXMLAccount(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            strict: false,
            trim: true,
            explicitArray: true
          });
      let itemArrs = [];
      parser.parseString(data, function (err, result) {
        let totalCount;
        if(result.FIXML.Body === undefined){
          var obj = result.FIXML.BODY[0].EXECUTEFINACLESCRIPTRESPONSE[0].EXECUTEFINACLESCRIPT_CUSTOMDATA[0].CALASUMMARYDTL[0];
          totalCount = result.FIXML.BODY[0].EXECUTEFINACLESCRIPTRESPONSE[0].EXECUTEFINACLESCRIPT_CUSTOMDATA[0].TOTRECCNT;
        }else{
          var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].CALASummaryDtl[0];
          totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt;
        }
        for (k in obj) {
          const id = k.split(/([0-9]+)/)[1];
          const item = k.split(/([0-9]+)/).filter(Boolean)[0].slice(0, -1);
          if (itemArrs.length > 0) {
            const index = _.findIndex(itemArrs, { no: id });
            if (index == -1) {
              itemArrs.push({ [`${item}`]: obj[k][0], no: id });
            } else {
              itemArrs[index][item] = obj[k][0]
            }
          }
          else {
            itemArrs.push({ [`${item}`]: obj[k][0], no: id });
          }
        }
        let resolvedArrAcc = [itemArrs, totalCount]
        resolve(resolvedArrAcc);
      });
    });
  }
  // // parse the XML data for dropdown
  parseXMLDropdown(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArrs = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        for (k in obj) {
          const id = k.split(/([0-9]+)/)[1];
          const item = k.split(/([0-9]+)/).filter(Boolean)[0].slice(0, -1);
          if (itemArrs.length > 0) {
            const index = _.findIndex(itemArrs, { no: id });
            if (index == -1) {
              itemArrs.push({ [`${item}`]: obj[k][0], no: id });
            } else {
              itemArrs[index][item] = obj[k][0]
            }
          }
          else {
            itemArrs.push({ [`${item}`]: obj[k][0], no: id });
          }
        }
        let resolvedArrDrp = [itemArrs]
        resolve(resolvedArrDrp);
      });
    });
  }
  onExcelDownload() {
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);

    let fromDate = this.fromdate;
    let toDate = this.todate;
    
    let finalVal = '';
    if (fromDate) {
      finalVal = this.baseService.dateformatasperddmmyy(fromDate);
    }

    let finalValforodate = '';
    if (toDate) {
      finalValforodate = this.baseService.dateformatasperddmmyy(toDate);
    }

    let actnumber = this.accountnumber;
    if(actnumber == null || actnumber == undefined){
      actnumber = "";
    }

    let url = Url.calaStatementDownload;
    localStorage.setItem('popUpManagement', 'true');
    
    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.fromDate = finalVal.toString();
    body.toDate = finalValforodate.toString();
    body.recFromNo = "1";
    body.recToNo = (this.toCount).toString();
    body.accNo = actnumber.toString();
    body.precisionType = this.radioValue2;

    this.baseService.downloadFile(url,body,"calaStatement.xls");

    localStorage.setItem('popUpManagement', 'false');
  }

  onRefreshClick() {
    this.getxmldataforCALAOnInit();
  }
  onAccExcelDownload() {
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);

    let fromDate = this.fromdate;
    let toDate = this.todate;

    let monthdate = this.monthdate;
    let finalYearVal = '';
    let finalMonthVal = '';

    if (monthdate) {
      finalMonthVal = this.baseService.dateformataspermm(monthdate);
      finalYearVal = this.baseService.dateformatasperyy(monthdate);
    }
    let actnumber = this.accNumber;
    if(actnumber == null || actnumber == undefined){
      actnumber = "";
    }

    if(finalMonthVal == null || finalMonthVal == undefined){
      finalMonthVal = "";
    }

    if(finalYearVal == null || finalYearVal == undefined){
      finalYearVal = "";
    }

    let url = Url.calareconsilationAccDownload;
    localStorage.setItem('popUpManagement', 'true');
    
    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.month = finalMonthVal.toString();
    body.year = finalYearVal.toString();
    body.recFromNo = "1";
    body.recToNo = (this.toCount).toString();
    body.accNo = actnumber.toString();
    body.precisionType = this.radioValue2;

    this.baseService.downloadFile(url,body,"calaStatement.xls");

    localStorage.setItem('popUpManagement', 'false');
  }

  onAccRefreshClick() {
    this.getxmldataforCALAOnInit();
  }
}