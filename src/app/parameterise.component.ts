import { Component, OnInit, Input } from '@angular/core';

import { Parameterisation } from './parameterisation';

import { CookieService } from 'angular2-cookie/core';
import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';


@Component({
  selector: 'my-parameterise',
  templateUrl: 'parameterise.component.html',
})
export class ParameteriseComponent implements OnInit {
  parameterisation: Parameterisation = {
    insert: {
      x: [0],
      y: [0]
    },
    width: null,
    length: null,
    circle: null,
    ellipse: null
  };
  jsonValid: boolean = true;
  jsonErrorMessage: string;

  dataInFlight: boolean = false;

  constructor(
    private electronApiService: ElectronApiService,
    private dataService: DataService,
    private cookieService:CookieService
  ) { }

  getData(): void {
    let cookieParameterisation = this.cookieService.getObject("parameterisation")
    // let cookieParameterisation: any = null;
    if (cookieParameterisation) {
      this.parameterisation.insert = cookieParameterisation['insert'];
      this.parameterisation.width = cookieParameterisation['width'];
      this.parameterisation.length = cookieParameterisation['length'];
      this.parameterisation.circle = cookieParameterisation['circle'];
      this.parameterisation.ellipse = cookieParameterisation['ellipse'];
    }
    else {
      this.dataService.getParameterisationData()
        .then(parameterisation => {
          this.parameterisation = parameterisation
          this.cookieService.putObject("parameterisation", this.parameterisation)
        });
    }
  }

  onSubmit() {
    this.dataInFlight = true;
    this.electronApiService.parameteriseInsert(JSON.stringify(this.parameterisation.insert))
      .then(parameterisationResult => {
        this.parameterisation.circle = parameterisationResult.circle;
        this.parameterisation.ellipse = parameterisationResult.ellipse;
        this.parameterisation.width = parameterisationResult.width;
        this.parameterisation.length = parameterisationResult.length;
        this.dataInFlight = false;
        this.cookieService.putObject("parameterisation", this.parameterisation)
      });
  }


  parseAndCheckJSON(jsonInput:string) {
    this.jsonValid = false;
    try {
      let parsedJSON = JSON.parse(jsonInput);
      if ('x' in parsedJSON && 'y' in parsedJSON) {
        if (parsedJSON.x.length === parsedJSON.y.length) {
          let x: [number] = parsedJSON.x
          let y: [number] = parsedJSON.y
          let insert = {
            x: x,
            y: y
          }
          this.parameterisation.insert = insert
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
    this.getData();
  }

}
