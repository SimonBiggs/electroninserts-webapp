import { Component, OnInit, Input } from '@angular/core';

import { MdlDefaultTableModel } from 'angular2-mdl';

import { Parameterisation } from './parameterisation'

import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';


@Component({
  selector: 'my-parameterise',
  templateUrl: 'parameterise.component.html',
})
export class ParameteriseComponent implements OnInit {
  parameteriseInput: string;
  parameterisation: Parameterisation = {
    insert: '',
    circle: null,
    ellipse: null
  };
  parsedJSON: any;
  jsonValid: boolean = true;
  jsonErrorMessage: string;
  parameterisationResult: any;
  circle = {};
  ellipse = {};
  dataInFlight: boolean = false;

  tableData:[any] = [
      {width:NaN, length:NaN}
  ];

  public tableModel = new MdlDefaultTableModel([
        {key:'width', name:'Width', sortable:true, numeric:true},
        {key:'length', name:'Length', sortable:true, numeric:true}
      ]);

  constructor(
    private electronApiService: ElectronApiService,
    private dataService: DataService
  ) { }

  getData(): void {
    this.dataService.getParameterisationData()
      .then(parameterisation => {
        this.parameterisation = parameterisation
        this.parameteriseInput = this.parameterisation.insert
      });
  }

  onSubmit() {
    this.dataInFlight = true;
    this.electronApiService.parameteriseInsert(this.parameteriseInput)
      .then(parameterisationResult => {
        this.parameterisationResult = parameterisationResult;
        this.addResultToTable(parameterisationResult);
        this.convertResultToDisplayCoords(parameterisationResult);
        this.dataInFlight = false;
      });
  }

  addResultToTable(parameterisationResult:any) {
    this.tableData[0].width = parameterisationResult.width;
    this.tableData[0].length = parameterisationResult.length;
  }

  convertResultToDisplayCoords(parameterisationResult:any) {
    this.circle = parameterisationResult.circle;
    this.ellipse = parameterisationResult.ellipse;
  }

  checkJSON() {
    this.jsonValid = false;
    try {
      let json_test = JSON.parse(this.parameteriseInput);
      if ('x' in json_test && 'y' in json_test) {
        this.parsedJSON = json_test;
        if (this.parsedJSON.x.length === this.parsedJSON.y.length) {
          this.jsonValid = true;
        }
        else {
          this.jsonErrorMessage = 'The length of x doesn\'t match the length of y.';
        }
      }
      else {
        this.jsonErrorMessage = 'Either x or y is missing.';
      }
    }
    catch(err) {
      this.jsonErrorMessage = 'Error in JSON input. ' + err ;
    }
    finally {

    }
  }

  ngOnInit() {
    this.electronApiService.wakeUpServer();
    this.tableModel.addAll(this.tableData);
    this.getData();
  }

}
