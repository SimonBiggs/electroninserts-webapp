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
  
  plot_width = 600

  triggerTextboxUpdate = false

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

  currentMachineSettingsUpdated(newSettings: {}) {
    console.log('use-model.component currentMachineSettingsUpdated')                
    for (let key of ['machine', 'energy', 'applicator', 'ssd']) {
      this.currentSettings[key] = newSettings[key]
    }
    this.loadMeasuredData()
  }

  loadMeasuredData() {
    console.log('use-model.component loadMeasuredData')                    
    this.dataPersistenceService.loadModelData(this.modelData, this.currentSettings).then(() => {
      this.updateModelLookup()
      this.updatePredictedFactors()
      
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
    this.saveModel()
  }
}