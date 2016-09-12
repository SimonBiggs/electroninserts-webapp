import { Component, OnInit, Input } from '@angular/core';

import { Parameterisation } from './parameterisation';

import { CookieService } from 'angular2-cookie/core';
import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';

import { DEMO_PARAMETERISE_INPUT } from './demo-data';

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
  // jsonValid: boolean = true;
  // jsonErrorMessage: string;

  jsonValid: boolean = true;

  serverResponseValid: boolean = true;
  serverErrorMessage: string;

  dataInFlight: boolean = false;

  submitDisabled: boolean = false;

  constructor(
    private electronApiService: ElectronApiService,
    private dataService: DataService,
    private cookieService:CookieService
  ) { }

  getData(): void {
    let cookieParameterisation = this.cookieService.getObject("last_parameterisation")
    // let cookieParameterisation: any = null;
    if (cookieParameterisation) {
      this.parameterisationFromCookie(cookieParameterisation);
    }
    else {
      this.loadDemoData();
    }
  }

  loadDemoData(): void {
    // this.dataService.getParameterisationData()
    //   .then(parameterisation => {
    //     this.parameterisation = parameterisation
    //   });
    let demoData = JSON.parse(JSON.stringify(DEMO_PARAMETERISE_INPUT));
    this.insertUpdated(demoData.insert);    
  }

  onSubmit() {
    this.dataInFlight = true;
    this.checkSubmitButton();
    this.electronApiService.parameteriseInsert(JSON.stringify(this.parameterisation.insert))
      .then(parameterisationResult => {
        this.parameterisation.circle = parameterisationResult.circle;
        this.parameterisation.ellipse = parameterisationResult.ellipse;
        this.parameterisation.width = parameterisationResult.width;
        this.parameterisation.length = parameterisationResult.length;
        this.dataInFlight = false;
        this.serverResponseValid = true;
        this.checkSubmitButton()
        this.cookieService.putObject(JSON.stringify(this.parameterisation.insert), this.parameterisation)
        this.cookieService.putObject('last_parameterisation', this.parameterisation)        
      })
  }

  parameterisationFromCookie(cookieParameterisation: Object) {
    this.parameterisation.insert = cookieParameterisation['insert'];
    this.parameterisation.width = cookieParameterisation['width'];
    this.parameterisation.length = cookieParameterisation['length'];
    this.parameterisation.circle = cookieParameterisation['circle'];
    this.parameterisation.ellipse = cookieParameterisation['ellipse'];
  }

  insertUpdated(insert: any) {
    let cookieParameterisation = this.cookieService.getObject(JSON.stringify(insert))
    if (cookieParameterisation) {
      this.parameterisationFromCookie(cookieParameterisation);
    }
    else {
      this.parameterisation.insert = insert
      this.parameterisation.width = null;
      this.parameterisation.length = null;
      this.parameterisation.circle = null;
      this.parameterisation.ellipse = null;
    }
  }

  onJsonStatusChange(jsonStatus: boolean) {
    this.jsonValid = jsonStatus;
    this.checkSubmitButton();
  }

  checkSubmitButton() {
    if (this.dataInFlight || !this.jsonValid ) {
      this.submitDisabled = true;
    }
    else {
      this.submitDisabled = false;
    }
  }

  // parseAndCheckJSON(jsonInput:string) {
  //   this.jsonValid = false;
  //   try {
  //     let parsedJSON = JSON.parse(jsonInput);
  //     if ('x' in parsedJSON && 'y' in parsedJSON) {
  //       if (parsedJSON.x.length === parsedJSON.y.length) {
  //         let cookieParameterisation = this.cookieService.getObject(JSON.stringify(parsedJSON))
  //         if (cookieParameterisation) {
  //           this.parameterisationFromCookie(cookieParameterisation);
  //         }
  //         else {
  //           let x: [number] = parsedJSON.x
  //           let y: [number] = parsedJSON.y
  //           let insert = {
  //             x: x,
  //             y: y
  //           }
  //           this.parameterisation.insert = insert
  //           this.parameterisation.width = null;
  //           this.parameterisation.length = null;
  //           this.parameterisation.circle = null;
  //           this.parameterisation.ellipse = null;
  //         }
  //         this.jsonValid = true;
  //       }
  //       else {
  //         this.jsonErrorMessage = 'The length of x doesn\'t match the length of y.';
  //       }
  //     }
  //     else {
  //       this.jsonErrorMessage = 'Either x or y is missing.';
  //     }
  //   }
  //   catch(err) {
  //     this.jsonErrorMessage = 'Error in JSON input. ' + err ;
  //   }
  //   finally {

  //   }
  // }

  ngOnInit() {
    this.getData();
  }

}
