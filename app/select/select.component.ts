import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { VERSION } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { take, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
interface ComboResponse {
  id: string;
  detalle: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  onChange: (val: string) => void;
  onTouched: () => void;

  @Input() public placeholder = '';
  /** control for the selected bank */
  @Input() public control: FormControl = new FormControl();

  @Output('notifyOptionClicked') notifyOptionClicked: EventEmitter<any> = new EventEmitter<any>();

  /** control for the MatSelect filter keyword */
  public filterCtrl: FormControl = new FormControl();

  /** list of banks */
  // @Input() public values: ComboResponse[] = [];
  @Input() public values = new BehaviorSubject<ComboResponse[]>([{ detalle: '(Vacio)', id: null }]);

  /** list of banks filtered by search keyword */
  public filteredList: ReplaySubject<ComboResponse[]> = new ReplaySubject<ComboResponse[]>(1);


  @ViewChild('singleSelect') singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  private valueSubscripton: Subscription;

  ngOnInit() {
    this.valueSubscripton = this.values.subscribe(() => {
      this.filteredList.next(this.values.value.slice());
    })
    this.startSelect();
  }

  public startSelect() {


    // load the initial bank list


    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.valueSubscripton.unsubscribe();
  }

  /**
   * Sets the initial value after the filteredList are loaded initially
   */
  private setInitialValue() {
    this.filteredList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredList are loaded initially 
        // and after the mat-option elements are available
        // this.singleSelect.compareWith = (a: Bank, b: Bank) => a.id === b.id;
      });
  }

  private filterBanks() {
    if (!this.values.value) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredList.next(this.values.value.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredList.next(
      this.values.value.filter(bank => bank.detalle.toLowerCase().indexOf(search) > -1)
    );
  }


  touch() {
    this.onTouched();
  }

  change(val: string) {
    this.notifyOptionClicked.emit(val);
    this.onChange(val);
  }

  writeValue(value: string) {
    this.control.setValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState() { }

  public validate(c: FormControl) {
    return (c.valid) ? null : {
      error: {
        valid: false,
      },
    };
  }
}

/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

