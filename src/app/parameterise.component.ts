import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Parameterisation } from './parameterisation';

import { CookieService } from 'angular2-cookie/core';
import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';
import { TitleService } from './title.service'

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

  @ViewChild('jsonInput') jsonInputComponent: any;

  jsonValid: boolean = true;

  serverResponseValid: boolean = true;
  serverErrorMessage: string;

  dataInFlight: boolean = false;

  submitDisabled: boolean = false;

  refreshJsonInput: boolean = false;

  constructor(
    private electronApiService: ElectronApiService,
    private dataService: DataService,
    private cookieService: CookieService,
    private myTitleService: TitleService
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
    let demoData = JSON.parse(JSON.stringify(DEMO_PARAMETERISE_INPUT));
    this.insertUpdated(demoData.insert);
    this.jsonInputComponent.refresh = true;
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
      this.parameterisation.insert = insert;
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

  ngOnInit() {
    this.getData();
    this.myTitleService.setTitle('Parameterisation');
  }

}
