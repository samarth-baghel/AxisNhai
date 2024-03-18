import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from "@angular/material/icon";
import { BaseService } from 'src/app/core/base.service';
import { MatSnackBar } from '@angular/material';
import { Url } from 'src/app/core/services/url';
import { element } from 'protractor';
import { dateFormat } from 'highcharts';

interface Year {
  fromDate: string;
  toDate: string;
  viewValue: string;
}


@Component({
  selector: 'app-generate-reports',
  templateUrl: './generate-reports.component.html',
  styleUrls: ['./generate-reports.component.scss']
})
export class GenerateReportsComponent implements OnInit {
  today = new Date();
  value: string = "Amount in Rupees";
  dateValue1: any;
  dateValue2: any;
  dateValue3: any;
  dateValue4: any;
  dateValue5: any;
  fromdate: any;
  todate: any;
  radioSelectValue: any;
  radioValue2: any;
  FY: any;
  obj: {};
  years: Year[] = [];
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry,
    private _snackBar: MatSnackBar, public baseService: BaseService) {
    this.matIconRegistry.addSvgIcon('excel', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/excel.png'));
    for (let i = 2020; i <= +this.today.getFullYear(); i++) {
      this.years.push({ fromDate: this.baseService.dateFormatDDMMYYY(new Date("April 1, " + i)), toDate: this.baseService.dateFormatDDMMYYY(new Date("March 31, " + (i + 1))), viewValue: `${i}-${i + 1}` });
    }
    this.radioValue2 = "Amount in Rupees";
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onROBOByDayClk(date?: any) {

    let isValid = this.dateValidation(date);
    if (!isValid) {
      return;
    }
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);

    let finalVal = '';
    if (date) {
      let dateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      if (dateValue.getTime() == date1.getTime()) {
        date = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate() - 1);
      }
      finalVal = this.baseService.dateFormatDDMMYYY(date);
    }

    let url = Url.ageingReportDownload;
    localStorage.setItem('popUpManagement', 'true');

    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.date = finalVal.toString();
    body.precisionType = this.value;
    if (this.value === "Amount in Crores") {
      this.baseService.downloadFile(url, body, "AgeingReportAccountWise_Report in Crores.xls");
    } else {
      this.baseService.downloadFile(url, body, "AgeingReportAccountWise_Report in Rupees.xls");
    }
    //this.baseService.downloadFile(url, body, "AgeingReportAccountWise.xls");
    localStorage.setItem('popUpManagement', 'false');
  }


  onROPDBrackertWiseClk(date?: any) {
    let isValid = this.dateValidation(date);
    if (!isValid) {
      return;
    }
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);

    let finalVal = '';
    if (date) {
      let dateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      if (dateValue.getTime() == date1.getTime()) {
        date = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate() - 1);
      }
      finalVal = this.baseService.dateFormatDDMMYYY(date);
    }

    let url = Url.AgeingROAndPDReportDownload;
    localStorage.setItem('popUpManagement', 'true');

    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.date = finalVal.toString();
    body.precisionType = this.value;
    if (this.value === "Amount in Crores") {
      this.baseService.downloadFile(url, body, "AgeingROAndPDReport_Report in Crores.xls");
    } else {
      this.baseService.downloadFile(url, body, "AgeingROAndPDReport_Report in Rupees.xls");
    }
    //this.baseService.downloadFile(url, body, "AgeingROAndPDReport.xls");
    localStorage.setItem('popUpManagement', 'false');
  }

  onCRGenerateReportClk() {
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);
    let url = Url.creditReportDownload;
    localStorage.setItem('popUpManagement', 'true');
    let body: any = {};
    body.requestUUID = requestUUID;
    body.messageDateTime = messageDateTime;
    body.precisionType = this.value;
    if (this.value === "Amount in Crores") {
      this.baseService.downloadFile(url, body, "CreditReport_Report in Crores.xls");
    } else {
      this.baseService.downloadFile(url, body, "CreditReport_Report in Rupees.xls");
    }
    //this.baseService.downloadFile(url, body, "CreditReport.xls");
    localStorage.setItem('popUpManagement', 'false');
  }
  onMonthlyReport(FYear: any) {
    let dateArr = this.dateFormattingfromFY(this.years[FYear].viewValue);
    this.dateValue4 = dateArr[0];
    this.dateValue5 = dateArr[1];
    let isValid = this.fromDateToDateValidation(this.dateValue4, this.dateValue5);
    if (!isValid) {
      return;
    }
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = this.baseService.getRansdomWithUser(false);
    let finalVal1 = '', finalVal2 = '';
    if (this.dateValue4 && this.dateValue5) {
      finalVal1 = this.baseService.dateFormatDDMMYYY(this.dateValue4);
      finalVal2 = this.baseService.dateFormatDDMMYYY(this.dateValue5);
    }
    let url = Url.monthlyReportDownload;
    localStorage.setItem('popUpManagement', 'true');

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.precisionType = this.value;
    body.fromDate = finalVal1.toString();
    body.toDate = finalVal2.toString();
    if (this.value === "Amount in Crores") {
      this.baseService.downloadFile(url, body, "downloadRopdMonthlyReport_Report in Crores.xls");
    } else {
      this.baseService.downloadFile(url, body, "downloadRopdMonthlyReport_Report in Rupees.xls");
    }
    //this.baseService.downloadFile(url, body, "downloadRopdMonthlyReport.xls");
    localStorage.setItem('popUpManagement', 'false');
  }
  dateValidation(dateVal: any) {
    if (dateVal == undefined || dateVal == "" || dateVal == null) {
      this._snackBar.open("Date selection is mandatory", "", {
        duration: 4000,
      });
      return false;
    } else {
      return true;
    }
  }
  fromDateToDateValidation(fromDate: Date, toDate: Date) {

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

    return true;

  }
  dateFormattingfromFY(fyear: any) {
    let dateFormate = fyear.split('-');
    let fromDate: any, toDate: any;
    if (+dateFormate[0] === this.today.getFullYear()) {
      fromDate = new Date(+dateFormate[0], 3, 1);
      toDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1)
    } else if (+dateFormate[1] === this.today.getFullYear() && this.today.getMonth() < 3) {
      fromDate = new Date(+dateFormate[0], 3, 1);
      toDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1)
    } else {
      fromDate = new Date(+dateFormate[0], 3, 1);
      toDate = new Date(+dateFormate[1], 2, 31);
    }
    let data = [fromDate, toDate];
    return data;
  }
  onItemChange(value?: any) {

    this.value = value;
  }
}
