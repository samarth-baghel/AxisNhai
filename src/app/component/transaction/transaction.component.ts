import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatSnackBar } from '@angular/material';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  today = new Date();
  radioValue1: string;
  sortedData: any;
  radioValuecurrency1: string;
  accountParsedArr: any;
  radioValue2: string;
  totalCount: any;
  pageSize: any;
  fromCount = 1;
  toCount = 10;
  accountnumber: any = "";
  fromdate: any;
  todate: any;
  transactiondate: any;
  accTransaction: any;
  fromDates: any;
  account: any;
  url:any;
  creditTypes:any;


  constructor(private _snackBar: MatSnackBar, public baseService: BaseService) {
    this.radioValue1 = "Account Number";
    this.radioValuecurrency1 = "Amount in Rupees";
    this.pageSize = 10;
  }
  datasources: any;
  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() { }

  onRefreshClick() {
    this.getXmlDataAccounttransactionOnInit();
  }
  onItemChange(value?: any) {
    this.getXmlDataAccounttransactionOnInit();
  }

  onSearchclick(serachcriteria, accountno, fromvalue, tovalue, transacionday) {

    if (!this.account && !this.fromDates && !this.accTransaction) {
      this._snackBar.open("Please Select atleast Two options", "", {
        duration: 4000,
      });
      accountno = '',
        fromvalue = '',
        tovalue = '',
        transacionday = ''
      return
    }

    if ((!this.account || !this.fromDates) && (!this.account || !this.accTransaction) && (!this.fromDates || !this.accTransaction)) {
      this._snackBar.open("Please Select atleast Two Search Criteria", "", {
        duration: 4000,
      });
      accountno = '',
        fromvalue = '',
        tovalue = '',
        transacionday = ''
      this.dataSource.data = [];


      return
    } else {
      if (this.account) {

        if (!accountno) {
          this._snackBar.open("Please Enter the Account Number", "", {
            duration: 4000,
          });
          accountno = ''
          return;
        }
      } else {
        accountno = ''
      }
      if (this.fromDates) {
        if (!fromvalue || !tovalue) {
          this._snackBar.open("Please Pick the both dates.", "", {
            duration: 4000,
          });
          fromvalue = '';
          tovalue = '';
          return;
        }
      } else {
        fromvalue = '';
        tovalue = '';
      }
      if (this.accTransaction) {
        if (!transacionday) {
          this._snackBar.open("Please Pick  the Transaction Date.", "", {
            duration: 4000,
          });
          transacionday = ''
          return;
        }
      } else {
        transacionday = ''
      }
    }

    this.getXmlDataAccounttransactionOnInit(serachcriteria, accountno, fromvalue, tovalue, transacionday);

  }
  onReset() {
    this.account = null;
    this.fromDates = null;
    this.accTransaction = null;

    this.accountnumber = '';
    this.fromdate = '';
    this.todate = '';
    this.transactiondate = '';
    this.getXmlDataAccounttransactionOnInit(this.radioValue1, this.accountnumber, this.fromdate, this.todate, this.transactiondate);
  }
  onExcelDownloadClick() {
    let isValid = this.fromDateToDateValidation(this.fromdate, this.todate);
    if (!isValid) {
      return;
    }
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);

    let finalVal = '';
    if (this.fromdate) {
      finalVal = this.baseService.dateFormatDDMMYYY(this.fromdate);
    }

    let finalValforodate = '';
    if (this.todate) {
      finalValforodate = this.baseService.dateFormatDDMMYYY(this.todate);
    }

    let finalValtransactiondate = '';
    if (this.transactiondate) {
      finalValtransactiondate = this.baseService.dateFormatDDMMYYY(this.transactiondate);
    }

    var fromdate = finalVal;
    var todate = finalValforodate;
    var transDate = finalValtransactiondate;
    var accountnumber = this.accountnumber;
    var aco = "", frmdate = "", tod = "";
    if (this.radioValue1 == "Account Number") {
      if (this.accountnumber == undefined || this.accountnumber == "") {
        accountnumber = "";
      }
      aco = accountnumber.toString();
    } else if (this.radioValue1 == "from date") {
      frmdate = fromdate;
      tod = todate;
    } else if (this.radioValue1 == "account transaction") {
      frmdate = finalValtransactiondate;
      tod = finalValtransactiondate;
    }

    let url = Url.transactionSummaryDownload;
    localStorage.setItem('popUpManagement', 'true');
    console.log(frmdate,finalValtransactiondate,tod,todate,"samart")
    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.accountId = aco.toString();
    body.fromDate = (frmdate || fromdate ? fromdate  : finalValtransactiondate);
    body.toDate = (tod || todate ? todate :  finalValtransactiondate);
    body.FromCount = "1";
    body.ToCount = "999999" //this.toCount ? this.toCount.toString() : "";
    body.precisionType = this.radioValuecurrency1;
    this.baseService.downloadFile(url, body, "transactionSummary.xls");

    localStorage.setItem('popUpManagement', 'false');
  }

  pageEvent(event, accountnumber, fromdate, todate, transactiondate) {
    this.fromCount = (event.pageIndex * event.pageSize) + 1;
    this.toCount = (event.pageIndex + 1) * event.pageSize;
    this.getXmlDataAccounttransactionOnInit(accountnumber, fromdate, todate, transactiondate);
  }
  multiRadioBtn(btn: string) {
    switch (btn) {

      case 'acc':
        if (this.account)
          this.account = null;
        break;
      case 'date':
        if (this.fromDates)
          this.fromDates = null;
        break;
      case 'trans':
        if (this.accTransaction)
          this.accTransaction = null;
        break;
    }


  }
  fromDateToDateValidation(fromDate: Date, toDate: Date) {
    if (this.radioValue1 == "from date") {
      if (fromDate != undefined) {
        if (toDate != undefined) {
          if (fromDate > toDate) {
            this._snackBar.open("Please ensure that the End Date is greater than or equal to the Start Date", "", {
              duration: 4000,
            });
            return false;
          }
        } else {
          this._snackBar.open("Please give To Date", "", {
            duration: 4000,
          });
          return false;
        }
      }

      if (toDate != undefined) {
        if (fromDate != undefined) {
          if (fromDate > toDate) {
            this._snackBar.open("Please ensure that the End Date is greater than or equal to the Start Date", "", {
              duration: 4000,
            });
            return false;
          }
        } else {
          this._snackBar.open("Please give From Date", "", {
            duration: 4000,
          });
          return false;
        }
      }
    }
    return true;
  }


  private getXmlDataAccounttransactionOnInit(serachcriteria?: any, accountno?: any, fromvalue?: any, tovalue?: any, transacionday?: any, date?: any) {
    let sortedDateValue = []
    let isValid = this.fromDateToDateValidation(this.fromdate, this.todate);
    if (!isValid) {
      return;
    }

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(true);

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let finalVal = '';
    if (this.fromdate) {
      finalVal = this.baseService.dateFormatDDMMYYY(this.fromdate);
    }

    let finalValforodate = '';
    if (this.todate) {
      finalValforodate = this.baseService.dateFormatDDMMYYY(this.todate);
    }

    let finalValtransactiondate = '';
    if (this.transactiondate) {
      finalValtransactiondate = this.baseService.dateFormatDDMMYYY(this.transactiondate);

    }

    var fromdate = finalVal;
    var todate = finalValforodate;
    var accountnumber = this.accountnumber;
    var aco = '', frmdate = "", tod = "";

    if (this.account == "Account Number") {

      if (accountnumber == undefined) {
        accountnumber = '';
      }
      aco=this.baseService.encryptionFunction(accountnumber);
    }
    if (this.fromDates == "from date") {
      if (fromdate == undefined || todate == undefined) {
        frmdate = '';
        tod = '';
      }
      frmdate = fromdate;
      tod = todate;
    }
    if (this.transactiondate == "account transaction") {
      if (finalValtransactiondate == undefined) {
        frmdate = '';
        tod = '';
      }
      frmdate = finalValtransactiondate;
      tod = finalValtransactiondate;
    }
    body.AccountNumber = (aco);
    body.FromDate = frmdate ? fromdate : finalValtransactiondate;
    body.ToDate = tod ? todate : finalValtransactiondate;
    body.FromCount = (this.fromCount).toString();
    body.ToCount = (this.toCount).toString();

    const headers = this.baseService.getHeaders();
    console.log(body);
    let eBody:any;
    if(this.creditTypes == 'singleCredit')
    {
      eBody = this.baseService.encryptionFunctionObject(body)
    }else eBody = body;
    this.baseService._makeRequest(this.url,
      eBody,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        let dRes:any;
        if(this.creditTypes == 'singleCredit')
        {
          dRes = this.baseService.dencryptionFunction(res)
        }else dRes = res;
        this.parseXML(dRes,this.creditTypes).then((parseData) => {
          this.accountParsedArr = parseData[0];

          if (this.radioValuecurrency1 == "Amount in Crores") {
            this.accountParsedArr.forEach((data) => {
              if (data.AMOUNT) {
                data.AMOUNT = ((data.AMOUNT) / 10000000)
              }

              if (data.RUNING_BALANCE) {
                data.RUNING_BALANCE = ((data.RUNING_BALANCE) / 10000000)
              }
            })
            parseData = this.accountParsedArr;
          }


          this.dataSource.data = this.accountParsedArr;
          this.totalCount = parseData[1];
        })
      })
  }

  displayedColumns: string[] = ['REC_CNT', 'ACCOUNT_NUMBER', 'ACCOUNT_NAME', 'ACCOUNT_OPEN_DATE', 'TRAN_DATE', 'DR_CR_IND', 'AMOUNT', 'BENEFICIARY_NAME', 'BENEFICIARY_BANK_ACCT', 'IFSI_CODE', 'UTR', 'RUNING_BALANCE'];

  selectedValue(credit: any, accountno, fromvalue, tovalue, transacionday) {
    if (!credit) {
      this._snackBar.open("Select the credit !!", "", {
        duration: 4000,
      });
    } else if ((!this.account || !this.fromDates) && (!this.account || !this.accTransaction) && (!this.fromDates || !this.accTransaction)) {
      this._snackBar.open("Please Select atleast Two Search Criteria(Account option must be selected)", "", {
        duration: 4000,
      });
      accountno = '',
        fromvalue = '',
        tovalue = '',
        transacionday = ''
      this.dataSource.data = [];
      return
    }
    else {
      if (!this.account) {

        this._snackBar.open("Account Number must selected", "", {
          duration: 4000,
        });
      }
      else {
        if (credit === "singleCredit") {
          this.url=Url.accounttransactionsXmlUrl
          this.onSearchclick(this.radioValue1, this.accountnumber, this.fromdate, this.todate, this.transactiondate)
        }
        else if (credit === "multiCredit") {
          this.url=Url.accountsXmlUrlmulticredit;
          this.onSearchclick(this.radioValue1, this.accountnumber, this.fromdate, this.todate, this.transactiondate)
        }
      }
    }
  }

  creditValue(ele:any){
    this.creditTypes=ele;
  }
  // parse the XML data
  parseXML(data,type) {

    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            strict: false,
            trim: true,
            explicitArray: true
          });

      parser.parseString(data,(err, result)=>{
        let arra = [];
        let subTransaction;
        console.log("Parsed --> ",result);
        if(type==="singleCredit"){       
          if(result.FIXML.Body === undefined){
            var arr = result.FIXML.BODY[0].EXECUTEFINACLESCRIPTRESPONSE[0].EXECUTEFINACLESCRIPT_CUSTOMDATA[0];
            var totalcount = result.FIXML.BODY[0].EXECUTEFINACLESCRIPTRESPONSE[0].EXECUTEFINACLESCRIPT_CUSTOMDATA[0].TOTRECCNT[0];
            subTransaction = arr.SUBSIDIARYTRANSACTION;
          } else{
            var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
            var totalcount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].TotRecCnt[0];
            subTransaction = arr.SubsidiaryTransaction;
          }

          subTransaction.forEach(element => {
          for (a in element) {
            if(a == "ACCOUNT_NUMBER")
            {
               let encryptedBase64Key="YWJjYWJjZGVmZGVmZ2hpZw==";
              let parsedBase64Key=CryptoJS.enc.Base64.parse(encryptedBase64Key);
              let decryptedData = CryptoJS.AES.decrypt( element[a][0], parsedBase64Key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
                } );
              element[a]=decryptedData.toString(CryptoJS.enc.Utf8);
            }else{
            element[a] = element[a][0];
          }
        }
          arra.push(element);
        });
        let resolvedArr = [arra, totalcount]
        resolve(resolvedArr);
      }
      if(type==="multiCredit"){
        var arr = result.Body.executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        var totalcount = result.Body.executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].TotRecCnt[0];
        let arra = [];
        let subTransaction = arr.SubsidiaryTransaction;
        subTransaction.forEach(element => {
          for (a in element) {
            if(a == "ACCOUNT_NUMBER" || a == "IFSI_CODE" || a == "BENEFICIARY_BANK_ACCT")
            {
               let encryptedBase64Key="YWJjYWJjZGVmZGVmZ2hpZw==";
              let parsedBase64Key=CryptoJS.enc.Base64.parse(encryptedBase64Key);
              let decryptedData = CryptoJS.AES.decrypt( element[a][0], parsedBase64Key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
                } );
              element[a]=decryptedData.toString(CryptoJS.enc.Utf8);
            }else{
            element[a] = element[a][0];
            }
          }
          arra.push(element);
        });
        let resolvedArr = [arra, totalcount]
        resolve(resolvedArr);
      }
      });
    });
  }
}
