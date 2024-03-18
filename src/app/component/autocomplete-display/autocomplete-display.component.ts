import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import xml2js from 'xml2js';
import * as _ from 'lodash';
/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'autocomplete-filter',
  templateUrl: 'autocomplete-display.component.html',
  styleUrls: ['autocomplete-display.component.scss'],
})
export class AutocompleteDisplayComponent implements OnInit {
  myControl = new FormControl();
  @Input() dropdowndata: string[];
  constructor(public baseService: BaseService) {
   
  } 

// filteredOptions: Observable<Number[]>;
autocompletedata :Observable<string[]>;
  ngOnInit() {

    //this.getDropdownData();
   
  }

  ngOnChanges( ) {
    this.autocompletedata = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    
  }
  

  private _filter(value: string): string[] {
    const filterValue = value;
 if(this.dropdowndata){
    return this.dropdowndata.filter(option => option.toString().toLowerCase().includes(filterValue.toLowerCase()));
   }
   }
}

