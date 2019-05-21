import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material';
import { MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public form: FormGroup;
  @ViewChild('bancoSelect') public bancoSelect: MatSelect;
  constructor(
    private fb: FormBuilder,

  ) {
    this.form = this.fb.group({
      codigo: [null],
      detalle: [null],
      idEmpresaVendedora: [null],
      idBanco: [2]
    });
  }
  public control: FormControl = new FormControl();
public list = [
  
    {detalle: 'banco 1', id: 1},
    {detalle: 'banco 2', id: 2},
    {detalle: 'banco 3', id: 3},
    {detalle: 'banco 4', id: 4}
];
  ngOnInit() {
   // this.control.setValue(1);
    setTimeout(() => {
      this.bancoSelect.values.next(this.list);
      //this.bancoSelect.startSelect();
    }, 3000);



  }

  ngAfterViewInit() {

  }

  opcionClickeada(value){
    console.log('se ha clickeado la opcion '+ value);
  }

  ngOnDestroy() {
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */




}

/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */