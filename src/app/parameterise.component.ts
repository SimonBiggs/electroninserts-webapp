import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Parameterisation } from './parameterisation';

// import { CookieService } from 'angular2-cookie/core';
import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';
import { TitleService } from './title.service';
// import { LocalStorageService } from './local-storage.service';

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

  parameteriseURL = 'http://electronapi.simonbiggs.net/parameterise';

  constructor(
    private electronApiService: ElectronApiService,
    private dataService: DataService,
    private myTitleService: TitleService
  ) { }

  getData(): void {
    let localStorageParameterisation = localStorage["last_parameterisation"];
    if (localStorageParameterisation) {
      this.parameterisationFromLocalStorage(localStorageParameterisation);
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
    this.electronApiService.parameteriseInsert(
      this.parameteriseURL,
      JSON.stringify(this.parameterisation.insert)
    )
      .then((parameterisationResult: any) => {
        this.parameterisation.circle = parameterisationResult.circle;
        this.parameterisation.ellipse = parameterisationResult.ellipse;
        this.parameterisation.width = parameterisationResult.width;
        this.parameterisation.length = parameterisationResult.length;
        this.dataInFlight = false;
        this.serverResponseValid = true;
        this.checkSubmitButton()
        localStorage.setItem(
          JSON.stringify(this.parameterisation.insert), 
          JSON.stringify(this.parameterisation)
        );
        localStorage.setItem(
          "last_parameterisation", JSON.stringify(this.parameterisation)
        );
      })
  }

  parameterisationFromLocalStorage(localStorageParameterisationString: string) {
    let localStorageParameterisation = JSON.parse(localStorageParameterisationString); 
    this.parameterisation.insert = localStorageParameterisation['insert'];
    this.parameterisation.width = localStorageParameterisation['width'];
    this.parameterisation.length = localStorageParameterisation['length'];
    this.parameterisation.circle = localStorageParameterisation['circle'];
    this.parameterisation.ellipse = localStorageParameterisation['ellipse'];
  }

  insertUpdated(insert: any) {
    let localStorageParameterisation = localStorage.getItem(JSON.stringify(insert))
    if (localStorageParameterisation) {
      this.parameterisationFromLocalStorage(localStorageParameterisation);
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
