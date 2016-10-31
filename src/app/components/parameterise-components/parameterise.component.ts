import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { Parameterisation, InsertData } from '../../services/data-services/insert-data'

// import { CookieService } from 'angular2-cookie/core';
import { ElectronApiService } from '../../services/server-api-services/electron-api.service';
import { TitleService } from '../../services/utility-services/title.service';
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { CurrentSettings } from '../../services/data-services/current-settings'
// import { LocalStorageService } from './local-storage.service';

import { ModelData } from '../../services/data-services/model-data'

import { DEMO_PARAMETERISE_INPUT } from '../../services/data-services/demo-data';

@Component({
  selector: 'my-parameterise',
  templateUrl: 'parameterise.component.html',
})
export class ParameteriseComponent implements OnInit {
  machineSpecifications: {};

  // @ViewChild('jsonInput') jsonInputComponent: any;

  textAreaX: string;
  textAreaY: string;

  jsonValid: boolean = true;
  xInputValid: boolean = true;
  yInputValid: boolean = true;
  equalLengths: boolean = true;

  serverResponseValid: boolean = true;
  serverErrorMessage: string;

  dataInFlight: boolean = false;

  submitDisabled: boolean = false;

  refreshJsonInput: boolean = false;

  parameteriseURL: string;

  machineExists: boolean = false;
  machineSettingsExist: boolean = false;
  modelExists: boolean = false;

  ableToAddDataToModel: boolean = false;
  dataAlreadyExistsOnModel: boolean = false;

  serverError: boolean = false;

  R50: number;

  insertData = new InsertData()

  constructor(
    private electronApiService: ElectronApiService,
    private myTitleService: TitleService,
    private router: Router,
    private modelData: ModelData,
    private currentSettings: CurrentSettings,
    private dataPersistenceService: DataPersistenceService,
  ) { }

  ngOnInit() {
    console.log('parameterisation.component ngOnInit')
    this.getData();
    this.myTitleService.setTitle('Parameterisation');

    this.parameteriseURL = localStorage.getItem("parameteriseURL")
    if (this.parameteriseURL == null) {
      this.parameteriseURL = 'http://electronapi.simonbiggs.net/parameterise';
    }
    this.machineSpecifications = JSON.parse(localStorage.getItem("specifications"));
    if (this.machineSpecifications == null) {
      this.machineSpecifications = {};
    }
    this.checkMachineSettings()
    this.checkIfCanBeSentToModel()

    this.updateTextAreaValues()
  }

  addMeasuredFactor(measuredFactor: number) {
    console.log('parameterisation.component addMeasuredFactor')
    this.dataAlreadyExistsOnModel = true
    this.ableToAddDataToModel = false

    for (let key of Object.keys(this.currentSettings)) {
      this.currentSettings[key] = this.insertData[key]
    }

    this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings).then(() => {
      this.modelData.model.reset()

      this.modelData.measurement.width.push(Number(this.insertData.parameterisation.width))
      this.modelData.measurement.length.push(Number(this.insertData.parameterisation.length))
      this.modelData.measurement.measuredFactor.push(Number(measuredFactor))

      this.dataPersistenceService.saveModelData(this.modelData, this.currentSettings)
        .catch(err => console.log('Error saving measured factor within parameterise' + err))
    })

    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
      .catch(err => console.log('Error updating current settings within parameterise' + err))
  }

  predictFactor() {
    console.log('parameterisation.component predictFactor')
    for (let key of Object.keys(this.currentSettings)) {
      this.currentSettings[key] = this.insertData[key]
    }
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings).then(() => {
      this.modelData.predictions.width.unshift(this.insertData.parameterisation.width)
      this.modelData.predictions.length.unshift(this.insertData.parameterisation.length)
      if (this.insertData.measuredFactor != 0 && this.insertData.measuredFactor != null) {
        this.modelData.predictions.measuredFactor.unshift(this.insertData.measuredFactor)
      }    

      this.dataPersistenceService.saveModelData(this.modelData, this.currentSettings).then(() => {
        this.router.navigate(["/use-model"])
      })
    })


  }

  updateTextAreaValues() {
    console.log('parameterisation.component updateTextAreaValues')
    this.textAreaX = String(this.insertData.parameterisation.insert.x)
      .replace(/,/g,', ')
    this.textAreaY = String(this.insertData.parameterisation.insert.y)
      .replace(/,/g,', ')
  }

  checkIfEqualLengths() {
    console.log('parameterisation.component checkIfEqualLengths')
    if (this.insertData.parameterisation.insert.x.length == this.insertData.parameterisation.insert.y.length) {
      this.equalLengths = true
    }
    else {
      this.equalLengths = false
    }
  }

  saveInsertData() {
    console.log('parameterisation.component saveInsertData')
    localStorage.setItem(
      "last_insertData", JSON.stringify(this.insertData))
  }

  validateInput(input: string): boolean {
    console.log('parameterisation.component validateInput')
    // return /^(-?\d*(\.\d+)?[,;\s]+)*-?\d*(\.\d+)?[,;\s]*$/.test(input)
    return /^[-\d\.,;\s]*$/.test(input)
    // return true
  }

  inputTextAreaX(xInput: string) {
    console.log('parameterisation.component inputTextAreaX')
    try {
      if (this.validateInput(xInput)) {
        this.insertData.parameterisation.insert.x = eval(
          '[' + xInput.replace(/[,;\n\t]\s*/g,', ') + ']')
        this.insertData.parameterisation.insertUpdated()  
        this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation)     
        this.xInputValid = true
        this.checkIfEqualLengths()
        this.saveInsertData()
        this.checkIfCanBeSentToModel()
      }
      else {
        this.xInputValid = false
      }
    }
    catch(err) {
      console.log(err)
      this.xInputValid = false
    }
  }

  inputTextAreaY(yInput: string) {
    console.log('parameterisation.component inputTextAreaY')
    try {
      if (this.validateInput(yInput)) {
        this.insertData.parameterisation.insert.y = eval(
          '[' + yInput.replace(/[,;\n\t]\s*/g,', ')  + ']')
        this.insertData.parameterisation.insertUpdated()
        this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation)     
        this.yInputValid = true
        this.checkIfEqualLengths()
        this.saveInsertData()
        this.checkIfCanBeSentToModel()
      }
      else {
        this.yInputValid = false
      }
    }
    catch(err) {
      console.log(err)
      this.yInputValid = false
    }
  }


  getData(): void {
    console.log('parameterisation.component getData')
    let localStorageInsertDataString = localStorage['last_insertData'];
    
    if (localStorageInsertDataString) {
      let object = JSON.parse(localStorageInsertDataString);
      this.insertData.fillFromObject(object)
    }
    else {
      // this.loadDemoData();
    }
  }

  loadDemoData(): void {
    console.log('parameterisation.component loadDemoData')
    this.insertData.reset()
    let demoData = JSON.parse(JSON.stringify(DEMO_PARAMETERISE_INPUT));
    this.insertData.parameterisation.insert = demoData.insert
    this.insertData.parameterisation.insertUpdated()
    this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation)     

    this.updateTextAreaValues()
    this.checkIfEqualLengths()
  }

  sleep(time: number) {
    console.log('parameterisation.component sleep')
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  recursiveServerSubmit() {
    console.log('parameterisation.component recursiveServerSubmit')
    this.serverError = false

    this.electronApiService.sendToServer(
      this.parameteriseURL,
      JSON.stringify(this.insertData.parameterisation.insert)
    )
      .then((parameterisationResult: any) => {
        this.insertData.parameterisation.circle = parameterisationResult.circle;
        this.insertData.parameterisation.ellipse = parameterisationResult.ellipse;
        this.insertData.parameterisation.width = parameterisationResult.width;
        this.insertData.parameterisation.length = parameterisationResult.length;
        let complete = parameterisationResult.complete;
        if (complete) {
          this.dataInFlight = false;
          this.serverResponseValid = true;
          this.checkSubmitButton()
          localStorage.setItem(
            JSON.stringify(this.insertData.parameterisation.insert), 
            JSON.stringify(this.insertData.parameterisation)
          );
          this.saveInsertData()
          this.checkIfCanBeSentToModel()
          if (this.insertData.parameterisation.width == null) {
            this.serverError = true
          }
        }
        else {
          this.sleep(500).then(() => this.recursiveServerSubmit());
        }
      })
  }

  checkIfCanBeSentToModel() {
    console.log('parameterisation.component checkIfCanBeSentToModel')
    this.ableToAddDataToModel = false;
    this.dataAlreadyExistsOnModel = false;
    if (this.machineSettingsExist) {
      for (let key of Object.keys(this.currentSettings)) {
        this.currentSettings[key] = this.insertData[key]
      }

      this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings).then(() => {
        if (this.modelData == null) {
          this.ableToAddDataToModel = true
        }
        else if (this.modelData.measurement == null) {
          this.ableToAddDataToModel = true
        }
        else {
          if (this.insertData.parameterisation.width != null && this.insertData.parameterisation.length != null && this.insertData.measuredFactor != null) {
            if (
                this.modelData.measurement.width.indexOf(Number(this.insertData.parameterisation.width)) > -1 &&
                this.modelData.measurement.length.indexOf(Number(this.insertData.parameterisation.length)) > -1 &&
                this.modelData.measurement.measuredFactor.indexOf(Number(this.insertData.measuredFactor)) > -1) {
              this.dataAlreadyExistsOnModel = true
            }
            else {
              this.dataAlreadyExistsOnModel = false
              this.ableToAddDataToModel = true
            }
          }
        }
      })


    }
    // console.log(this.ableToAddDataToModel)
  }

  checkMachineSettings() {
    console.log('parameterisation.component checkMachineSettings')
    this.R50 = null;
    let machine = this.insertData['machine'];
    let energy = this.insertData['energy'];
    let applicator = this.insertData['applicator'];
    let ssd = this.insertData['ssd'];
    if (this.machineSpecifications[machine]) {
      let specifications = this.machineSpecifications[machine];
      this.R50 = specifications['R50'][energy];
      if (
        specifications['energy'].indexOf(Number(energy)) > -1 && 
        specifications['applicator'].indexOf(String(applicator)) > -1 && 
        specifications['ssd'].indexOf(Number(ssd)) > -1) {
          this.machineSettingsExist = true;
      }
      else {
        this.machineSettingsExist = false;
      }
      this.machineExists = true;
    }
    else {
      this.machineExists = false;
      this.machineSettingsExist = false;
      this.modelExists = false;
    }
  }

  insertDataChange() {
    console.log('parameterisation.component insertDataChange')
    localStorage.setItem(
      "last_insertData", JSON.stringify(this.insertData)
    );
    this.checkMachineSettings()
    this.checkIfCanBeSentToModel()
  }

  onSubmit() {
    console.log('parameterisation.component onSubmit')
    this.dataInFlight = true;
    this.checkSubmitButton();
    this.recursiveServerSubmit();
  }

  insertDataFromLocalStorage(localStorageInsertData: string) {
    console.log('parameterisation.component insertDataFromLocalStorage')

  }

  onJsonStatusChange(jsonStatus: boolean) {
    console.log('parameterisation.component onJsonStatusChange')
    this.jsonValid = jsonStatus;
    this.checkSubmitButton();
  }

  checkSubmitButton() {
    console.log('parameterisation.component checkSubmitButton')
    if (this.dataInFlight || !this.jsonValid ) {
      this.submitDisabled = true;
    }
    else {
      this.submitDisabled = false;
    }
  }

  parameterisationServerChange(serverUrl: string) {
    console.log('parameterisation.component parameterisationServerChange')
    localStorage.setItem("parameteriseURL", serverUrl);
  }

}
