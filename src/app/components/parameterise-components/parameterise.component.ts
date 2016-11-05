import { Component, OnInit, Input, ViewChild, AfterViewInit, ApplicationRef, AfterContentInit } from '@angular/core';

import { Router } from '@angular/router';

import { Parameterisation, InsertData } from '../../services/data-services/insert-data'

import { ElectronApiService } from '../../services/server-api-services/electron-api.service';
import { TitleService } from '../../services/utility-services/title.service';
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { CurrentSettings } from '../../services/data-services/current-settings'
import { MachineSpecification, MachineSpecificationsService } from '../../services/data-services/specifications-data.service'
import { ServerURLs } from '../../services/data-services/dexie.service'

import { XYInputComponent } from './x-y-input.component'

import { ModelData } from '../../services/data-services/model-data'

import { DEMO_PARAMETERISE_INPUT } from '../../services/data-services/demo-data';

@Component({
  selector: 'my-parameterise',
  templateUrl: 'parameterise.component.html',
})
export class ParameteriseComponent implements OnInit, AfterViewInit, AfterContentInit {
  textInputsValid: boolean = true;
  equalLengths: boolean = true;

  serverResponseValid: boolean = true;
  serverErrorMessage: string;

  dataInFlight: boolean = false

  submitDisabled: boolean = false

  parameteriseURL: string

  machineExists: boolean = false
  machineSettingsExist: boolean = false

  ableToAddDataToModel: boolean = false;
  dataAlreadyExistsOnModel: boolean = false;

  serverError: boolean = false;

  insertData = new InsertData()
  machineSettings: CurrentSettings

  dataLoaded = false
  viewInitialised = false
  initialTextBoxUpdate = false

  constructor(
    private electronApiService: ElectronApiService,
    private myTitleService: TitleService,
    private router: Router,
    private modelData: ModelData,
    private dataPersistenceService: DataPersistenceService,
    private machineSpecificationService: MachineSpecificationsService,
    private applicationRef: ApplicationRef
  ) { }

  @ViewChild('textboxInputs') textboxInputs: XYInputComponent

  ngOnInit() {
    console.log('parameterisation.component ngOnInit')

    this.myTitleService.setTitle('Parameterisation')
    this.dataPersistenceService.loadServerUrl('parameterisation')
    .then((serverUrl: ServerURLs) => {
      if (serverUrl == null) {
        this.parameteriseURL = 'http://electronapi.simonbiggs.net/parameterise'
      }
      else {
        this.parameteriseURL = serverUrl.url
      } 
    })

    this.dataPersistenceService.loadCurrentInsertData(this.insertData)
    .then(() => {
      this.checkIfEqualLengths()
      return this.machineSpecificationService.loadData()
    })
    .then(() => {
      console.log('specifications.component ngOnInit this.machineSpecificationService.loadData() promise complete')
      this.machineSettings = this.machineSpecificationService.currentSettings
      this.checkMachineSettings()
      this.checkIfCanBeSentToModel()
      if (this.viewInitialised && !this.initialTextBoxUpdate) {
        this.textboxInputs.triggerUpdate = true
        this.initialTextBoxUpdate = true
      }
      this.dataLoaded = true
    })
  }

  ngAfterViewInit() {
    if (this.dataLoaded && !this.initialTextBoxUpdate) {
      this.textboxInputs.triggerUpdate = true
      this.initialTextBoxUpdate = true
    }
    this.viewInitialised = true 

    // this.sleep(10)
    // .then(() => {
    //   this.textboxInputs.triggerUpdate = true
    //   this.applicationRef.tick()
    // })
  }

  ngAfterContentInit() {
    // this.sleep(10)
    // .then(() => {
    //   this.textboxInputs.triggerUpdate = true
    //   this.applicationRef.tick()
    // })
  }

  checkMachineSettings() {
    console.log('parameterisation.component checkMachineSettings')
    if (this.machineSpecificationService.doesMachineExist(this.insertData.machine)) {
      this.machineExists = true
      this.machineSettingsExist = this.machineSpecificationService.checkInsertSettingsExist(this.insertData) 
    }
    else {
      this.machineExists = false;
      this.machineSettingsExist = false;
    }
    console.log(this.machineSettingsExist)
  }

  checkIfCanBeSentToModel() {
    console.log('parameterisation.component checkIfCanBeSentToModel')
    if (this.machineSettingsExist) {
      for (let key of Object.keys(this.machineSettings)) {
        this.machineSettings[key] = this.insertData[key]
      }
      this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings).then(() => {
        console.log('parameterisation.component checkIfCanBeSentToModel this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings) promise complete')
        if (
            this.modelData.measurement.width.indexOf(Number(this.insertData.parameterisation.width)) > -1 &&
            this.modelData.measurement.length.indexOf(Number(this.insertData.parameterisation.length)) > -1 &&
            this.modelData.measurement.measuredFactor.indexOf(Number(this.insertData.measuredFactor)) > -1) {
          this.dataAlreadyExistsOnModel = true
          this.ableToAddDataToModel = false
        }
        else {
          this.dataAlreadyExistsOnModel = false
          if (
            Number(this.insertData.parameterisation.width) == 0 || 
            Number(this.insertData.parameterisation.length) == 0 ||
            Number(this.insertData.measuredFactor) == 0
          )
          {
            this.ableToAddDataToModel = false
          }
          else {
            this.ableToAddDataToModel = true
          }
        }
      })
    }
    else {
      this.ableToAddDataToModel = false
      this.dataAlreadyExistsOnModel = false
    }
  }

  onValidTextboxChange() {
    console.log('parameterisation.component onValidTextboxChange')
    this.insertData.parameterisation.insertUpdated()
    this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation)
    .then(() => {
      console.log('parameterisation.component onValidTextboxChange this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation) promise complete')
      this.checkIfEqualLengths()
      this.checkIfCanBeSentToModel()
      return this.dataPersistenceService.saveCurrentInsertData(this.insertData)      
    })
    .then(() => {
      console.log('parameterisation.component onValidTextboxChange this.dataPersistenceService.saveCurrentInsertData(this.insertData)  promise complete')
    })

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

  addMeasuredFactor(measuredFactor: number) {
    console.log('parameterisation.component addMeasuredFactor')
    this.dataAlreadyExistsOnModel = true
    this.ableToAddDataToModel = false

    for (let key of Object.keys(this.machineSettings)) {
      this.machineSettings[key] = this.insertData[key]
    }

    this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings)
    .then(() => {
      console.log('parameterisation.component addMeasuredFactor this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings) promise complete')
      this.modelData.model.reset()

      this.modelData.measurement.width.unshift(Number(this.insertData.parameterisation.width))
      this.modelData.measurement.length.unshift(Number(this.insertData.parameterisation.length))
      this.modelData.measurement.measuredFactor.unshift(Number(measuredFactor))

      return this.dataPersistenceService.saveModelData(this.modelData, this.machineSettings)
    })
    .then(() => {
      console.log('parameterisation.component addMeasuredFactor this.dataPersistenceService.saveModelData(this.modelData, this.machineSettings) promise complete')
      return this.dataPersistenceService.saveCurrentSettings(this.machineSettings)
        
    })
    .then(() => {
      console.log('parameterisation.component addMeasuredFactor this.dataPersistenceService.saveCurrentSettings(this.machineSettings) promise complete')
    })

  }

  predictFactor() {
    console.log('parameterisation.component predictFactor')
    for (let key of Object.keys(this.machineSettings)) {
      this.machineSettings[key] = this.insertData[key]
    }
    this.dataPersistenceService.saveCurrentSettings(this.machineSettings)
    .then(() => {
      console.log('parameterisation.component predictFactor this.dataPersistenceService.saveCurrentSettings(this.machineSettings) promise complete')
      return this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings)
    })
    .then(() => {
      console.log('parameterisation.component predictFactor this.dataPersistenceService.loadModelData(this.modelData, this.machineSettings) promise complete')
      this.modelData.predictions.width.unshift(this.insertData.parameterisation.width)
      this.modelData.predictions.length.unshift(this.insertData.parameterisation.length)
      if (this.insertData.measuredFactor != 0 && this.insertData.measuredFactor != null) {
        this.modelData.predictions.measuredFactor.unshift(this.insertData.measuredFactor)
      }
      else {
        this.modelData.predictions.measuredFactor.unshift(null)
      }

      return this.dataPersistenceService.saveModelData(this.modelData, this.machineSettings)
    })
    .then(() => {
      console.log('parameterisation.component predictFactor this.dataPersistenceService.saveModelData(this.modelData, this.machineSettings) promise complete')
      this.router.navigate(["/use-model"])
    })


  }

  loadDemoData(): void {
    console.log('parameterisation.component loadDemoData')
    let insert = this.insertData.parameterisation.insert
    this.insertData.reset()
    this.insertData.parameterisation.insert = insert

    let demoData = JSON.parse(JSON.stringify(DEMO_PARAMETERISE_INPUT));
    this.insertData.parameterisation.insert.x = demoData.insert.x
    this.insertData.parameterisation.insert.y = demoData.insert.y
    this.insertData.parameterisation.insertUpdated()
    this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation)
    .then(() => {
      console.log('parameterisation.component loadDemoData this.dataPersistenceService.loadParameterisationCache(this.insertData.parameterisation) promise complete')
      this.textboxInputs.triggerUpdate = true
      this.checkIfEqualLengths()

      return this.dataPersistenceService.saveCurrentInsertData(this.insertData)
    })
    .then(() => {
      console.log('parameterisation.component loadDemoData this.dataPersistenceService.saveCurrentInsertData(this.insertData) promise complete')
    })
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
          this.dataPersistenceService.saveParameterisationCache(this.insertData.parameterisation)
          .then(() => {
            console.log('parameterisation.component recursiveServerSubmit this.dataPersistenceService.saveParameterisationCache(this.insertData.parameterisation) promise complete')
          })
          this.dataPersistenceService.saveCurrentInsertData(this.insertData)
          .then(() => {
            console.log('parameterisation.component recursiveServerSubmit this.dataPersistenceService.saveCurrentInsertData(this.insertData) promise complete')
          })
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

  insertDataChange() {
    console.log('parameterisation.component insertDataChange')
    this.dataPersistenceService.saveCurrentInsertData(this.insertData)
    .then(() => {
      console.log('parameterisation.component insertDataChange this.dataPersistenceService.saveCurrentInsertData(this.insertData) promise complete')
    })
    this.checkMachineSettings()
    this.checkIfCanBeSentToModel()
  }

  onSubmit() {
    console.log('parameterisation.component onSubmit')
    this.dataInFlight = true
    this.checkSubmitButton()
    this.recursiveServerSubmit()
  }


  onTextInputChange(testInputStatus: boolean) {
    console.log('parameterisation.component onTextInputChange')
    this.textInputsValid = testInputStatus;
    this.checkSubmitButton();
  }

  checkSubmitButton() {
    console.log('parameterisation.component checkSubmitButton')
    if (this.dataInFlight || !this.textInputsValid ) {
      this.submitDisabled = true;
    }
    else {
      this.submitDisabled = false;
    }
  }

  parameterisationServerChange(serverUrl: string) {
    console.log('parameterisation.component parameterisationServerChange')
    this.dataPersistenceService.saveServerUrl('parameterisation', serverUrl)
    .then(() => {

    })
  }

}
