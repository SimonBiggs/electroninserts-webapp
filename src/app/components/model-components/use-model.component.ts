import { Component, OnInit, ViewChild, NgZone, OnDestroy, AfterViewInit } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'
import { ModelData } from '../../services/data-services/model-data'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { CurrentSettings } from '../../services/data-services/current-settings'

import { WidthLengthAreaInputComponent } from './width-length-area-input.component'

import { validateInput } from '../../services/utility-services/sanitise-validation'


@Component({
  selector: 'my-use-model',
  templateUrl: './use-model.component.html'
})
export class UseModelComponent implements OnInit, OnDestroy, AfterViewInit {
  textboxLabels = {
    width: "Width of ellipse given by diameter of largest encompassed circle (cm @iso)",
    length: "Length of ellipse that matches insert shape area (cm @iso)",
    area: "[Optional] Area of insert shape (cm^2 @iso)",
    measuredFactor: "[Optional] Measured insert factor (as per TG 25)"
  }

  modelLookup = {}
  predictionDifference: number[] = []
  
  selectionList: boolean[] = []
  canBeSentToModel: boolean[] = []
  disableSendToModelButtons: boolean = true

  plot_width = 600

  @ViewChild('plotContainer') plotContainer: any
  @ViewChild('settingsPicker') settingsPicker: any
  @ViewChild('textboxInputs') textboxInputs: WidthLengthAreaInputComponent

  constructor(
    private modelData: ModelData,
    private myTitleService: TitleService,
    private dataPersistenceService: DataPersistenceService,
    private currentSettings: CurrentSettings,
    private ngZone: NgZone
  ) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.updatePlotWidth()
      })
    }
  }

  ngOnDestroy() {
    console.log('use-model.component ngOnDestroy')
    window.onresize = null
  }
  
  ngOnInit() {
    console.log('use-model.component ngOnInit')
    this.myTitleService.setTitle('Use Model')
    this.updatePlotWidth()
    this.updateModelLookup()

  }

  ngAfterViewInit() {
    console.log('use-model.component ngAfterViewInit')
    this.loadMeasuredData()
    this.updatePredictedFactors()
  }

  selectionChanged(selectionList: boolean[]) {
    console.log('use-model.component selectionChanged')
    this.selectionList = selectionList
    this.disableSendToModelButtons = true
    for (let i in this.selectionList) {
      if (this.selectionList[i] && this.canBeSentToModel[i]) {
        this.disableSendToModelButtons = false
      }
    }
  }

  lookupFactor(width: number, length: number) {
    console.log('use-model.component lookupFactor')
    width = Math.round(width*10)/10
    length = Math.round(length*10)/10

    let key: string
    key = String(width) + "," + String(length)

    return Math.round(this.modelLookup[key]*1000)/1000
  }

  updatePredictedFactors() {
    console.log('use-model.component updatePredictedFactors')
    this.modelData.predictions.predictedFactor = []

    let amount = Math.min(this.modelData.predictions.width.length, this.modelData.predictions.length.length)
    let predictedFactor: number
    let width: number
    let length: number
    for (let i = 0; i < amount; i++) {
      width = this.modelData.predictions.width[i]
      length = this.modelData.predictions.length[i]
      predictedFactor = this.lookupFactor(width, length)

      this.modelData.predictions.predictedFactor.push(predictedFactor)
    }
    
    this.updatePredictionDifference()
  }

  updatePredictionDifference() {
    console.log('use-model.component updatePredictionDifference')    
    this.predictionDifference = []
    let measuredFactor: number
    let predictedFactor: number
    let difference: number
    for (let i in this.modelData.predictions.measuredFactor) {
      measuredFactor = this.modelData.predictions.measuredFactor[i]
      predictedFactor = this.modelData.predictions.predictedFactor[i]
      difference = predictedFactor - measuredFactor
      difference = Math.round(difference * 1000) / 1000

      this.predictionDifference.push(difference)
    }
  }
  
  updateModelLookup() {
    console.log('use-model.component updateModelLookup')        
    this.modelLookup = {}
    let key: string
    for (let i in this.modelData.model.width) {
      key = String(this.modelData.model.width[i]) + "," + String(this.modelData.model.length[i])
      this.modelLookup[key] = this.modelData.model.predictedFactor[i]
    }
  }

  updatePlotWidth() {
    console.log('use-model.component updatePlotWidth')   
    this.plot_width = this.plotContainer.nativeElement.clientWidth
  }

  currentMachineSettingsUpdated(newSettings: CurrentSettings) {
    console.log('use-model.component currentMachineSettingsUpdated')
    this.currentSettings = newSettings
    this.loadMeasuredData()
  }

  loadMeasuredData() {
    console.log('use-model.component loadMeasuredData')
    if (this.currentSettings === undefined) {
      throw new RangeError("Tried to load measured data but current settings are not defined")
    }

    this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings).then(() => {
      console.log('use-model.component loadMeasuredData this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings) promise complete')   
      this.updateModelLookup()
      this.updatePredictedFactors()

      this.checkAllIfCanBeAddedToModel()
      
      this.textboxInputs.triggerUpdate = true
    })
  }

  saveModel() {
    console.log('use-model.component saveModel')                        
    this.dataPersistenceService.saveModelData(this.modelData, this.currentSettings)
  }

  onValidTextboxChange() {
    console.log('use-model.component onValidTextboxChange')                            
    this.updatePredictedFactors()
    this.checkAllIfCanBeAddedToModel()
    this.saveModel()
  }

  checkIfCanAddToModel(width: number, length: number, measuredFactor: number) {
    console.log('use-model.component checkIfCanAddToModel') 
    if (width != null && length != null && measuredFactor != null) {
      if (
        this.modelData.measurement.width.indexOf(Number(width)) > -1 &&
        this.modelData.measurement.length.indexOf(Number(length)) > -1 &&
        this.modelData.measurement.measuredFactor.indexOf(Number(measuredFactor)) > -1 
      ) {
        return false
      }
      else if (
        Number(width) == 0 || 
        Number(length) == 0 ||
        Number(measuredFactor) == 0
      ) {
        return false
      }
      else {
        return true
      }
    }
    else {
      return false
    }
  }

  checkAllIfCanBeAddedToModel() {
    console.log('use-model.component checkAllIfCanBeAddedToModel')
    this.canBeSentToModel = []
    let width: number
    let length: number
    let measuredFactor: number
    for (let i in this.modelData.predictions.width) {
      width = this.modelData.predictions.width[i]
      length = this.modelData.predictions.length[i]
      measuredFactor = this.modelData.predictions.measuredFactor[i]
      this.canBeSentToModel.push(this.checkIfCanAddToModel(
        width, length, measuredFactor))
    }
  }

  moveSelectedFactorsToModel() {
    console.log('use-model.component moveSelectedFactorsToModel')
    this.modelData.model.reset()
    for (let i = this.selectionList.length - 1; i > -1; i--) {
      if (this.selectionList[i] && this.canBeSentToModel[i] ) {
        for (let key of ['width', 'length', 'area', 'measuredFactor']) {
          this.modelData.measurement[key].unshift(Number(this.modelData.predictions[key][i]))
          this.modelData.predictions[key].splice(i, 1)
        }
      }
    }
    this.updatePredictedFactors()
    this.checkAllIfCanBeAddedToModel()
    this.saveModel()

    this.textboxInputs.triggerUpdate = true
  }

  addSelectedFactorsToModel() {
    console.log('use-model.component addSelectedFactorsToModel')
    this.modelData.model.reset()
    for (let i = this.selectionList.length - 1; i > -1; i--) {
      if (this.selectionList[i] && this.canBeSentToModel[i] ) {
        for (let key of ['width', 'length', 'measuredFactor']) {
          this.modelData.measurement[key].unshift(Number(this.modelData.predictions[key][i]))
        }
      }
    }
    this.checkAllIfCanBeAddedToModel()
    this.saveModel()
  }

  removeSelectedFactors() {
    console.log('use-model.component addSelectedFactorsToModel')
    for (let i = this.selectionList.length - 1; i > -1; i--) {
      if (this.selectionList[i]) {
        for (let key of ['width', 'length', 'area', 'measuredFactor']) {
          this.modelData.predictions[key].splice(i, 1)
        }
      }
    }
    this.updatePredictedFactors()
    this.checkAllIfCanBeAddedToModel()
    this.saveModel()

    this.textboxInputs.triggerUpdate = true
  }
}