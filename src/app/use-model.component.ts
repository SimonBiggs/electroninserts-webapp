import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { TitleService } from './title.service'
import { ModelData } from './model-data'

import { validateInput } from './sanitise-validation'

@Component({
  selector: 'my-use-model',
  templateUrl: './use-model.component.html'
})
export class UseModelComponent {
  textboxInput = {
    width: <string> null,
    length: <string> null,
    area: <string> null,
    measuredFactor: <string> null
  }

  textboxLabels = {
    width: "Width of ellipse given by diameter of largest encompassed circle (cm @iso)",
    length: "Length of ellipse that matches insert shape area (cm @iso)",
    area: "[Optional] Area of insert shape (cm^2 @iso)",
    measuredFactor: "[Optional] Measured insert factor (as per TG 25)"
  }

  textboxValid = {
    width: true,
    length: true,
    area: true,
    measuredFactor: true
  }

  currentSettings = {
    machine: <string> null,
    energy: <number> null,
    applicator: <string> null,
    ssd: <number> null
  }

  modelLookup = {}
  predictionDifference: number[] = []

  lengthSmallerThanWidth: boolean = false
  
  plot_width = 600

  @ViewChild('plotContainer') plotContainer: any
  @ViewChild('settingsPicker') settingsPicker: any

  constructor(
    private modelData: ModelData,
    private myTitleService: TitleService,
    ngZone: NgZone
  ) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.updatePlotWidth()
      })
    }
  }
  
  ngOnInit() {
    this.myTitleService.setTitle('Use Model')
    this.updatePlotWidth()
    this.updateModelLookup()
    this.loadMeasuredData()
    this.updatePredictedFactors()
  }
  

  // linearInterpolate(x: number, x1: number, x2: number, y1: number, y2: number) {
  //   let m = (y2 - y1) / (x2 - x1)
  //   let c = y1 - m * x1
  //   let y = m * x + c

  //   return y
  // }

  // bilinearInterpolate(
  //     x: number, y: number, 
  //     x_1: number, x_2: number, 
  //     y_1: number, y_2: number, 
  //     z_x1y1: number, z_x1y2: number, z_x2y1: number, z_x2y2: number) {
  //   let z_xy1 = this.linearInterpolate(x, x_1, x_2, z_x1y1, z_x2y1)
  //   let z_xy2 = this.linearInterpolate(x, x_1, x_2, z_x1y2, z_x2y2)

  //   let z_xy = this.linearInterpolate(y, y_1, y_2, z_xy1, z_xy2)

  //   return z_xy
  // }

  lookupFactor(width: number, length: number) {
    width = Math.round(width*10)/10
    length = Math.round(length*10)/10

    let key: string
    key = String(width) + "," + String(length)

    return Math.round(this.modelLookup[key]*1000)/1000
  }

  updatePredictedFactors() {
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
    this.modelLookup = {}
    let key: string
    for (let i in this.modelData.model.width) {
      key = String(this.modelData.model.width[i]) + "," + String(this.modelData.model.length[i])
      this.modelLookup[key] = this.modelData.model.predictedFactor[i]
    }
  }

  convertLengthToArea(width: number, length: number): number {
    let area = Math.PI * width * length / 4
    return Math.round(area*10)/10
  }

  convertAreaToLength(width: number, area: number): number {
    let length = 4 * area / (Math.PI * width)
    return Math.round(length*10)/10
  }

  updateAreaFromLength() {
    let width: number
    let length: number
    let area: number

    this.modelData.predictions.area = []

    for (let i in this.modelData.predictions.length) {
      width = this.modelData.predictions.width[i]
      length = this.modelData.predictions.length[i]

      area = this.convertLengthToArea(width, length)
      this.modelData.predictions.area.push(area)
    }
  }

  updateLengthFromArea() {
    let width: number
    let length: number
    let area: number

    this.modelData.predictions.length = []

    for (let i in this.modelData.predictions.area) {
      width = this.modelData.predictions.width[i]
      area = this.modelData.predictions.area[i]

      length = this.convertAreaToLength(width, area)
      this.modelData.predictions.length.push(length)
    }
  }

  updatePlotWidth() {
    this.plot_width = this.plotContainer.nativeElement.clientWidth
  }

  currentMachineSettingsUpdated(newSettings: {}) {
    for (let key of ['machine', 'energy', 'applicator', 'ssd']) {
      this.currentSettings[key] = newSettings[key]
    }
    this.loadMeasuredData()
  }

  // createLocalStorageKey() {
  //   let localStorageKey = (
  //     '{"machine":' + JSON.stringify(String(this.currentSettings.machine)) + ',' +
  //     '"energy":' + JSON.stringify(Number(this.currentSettings.energy)) + ',' +
  //     '"applicator":' + JSON.stringify(String(this.currentSettings.applicator)) + ',' +
  //     '"ssd":' + JSON.stringify(Number(this.currentSettings.ssd)) +
  //     '}')

  //   return localStorageKey
  // }

  loadMeasuredData() {
    this.modelData.loadModelData(this.currentSettings)
    // let localStorageKey = this.createLocalStorageKey()
    // let parsedData = JSON.parse(localStorage.getItem(localStorageKey))

    // this.modelData.fillFromObject(parsedData)

    if (this.modelData.predictions.length.length < this.modelData.predictions.area.length) {
      this.updateLengthFromArea()
    }
    else {
      this.updateAreaFromLength()
    }
    this.updateModelLookup()
    this.updatePredictedFactors()
    this.updateAllTextboxInputs()
  }

  saveModel() {
    this.modelData.saveModelData(this.currentSettings)
    // let localStorageKey = this.createLocalStorageKey()
    // localStorage.setItem(localStorageKey, JSON.stringify(this.modelData))
  }

  updateAllTextboxInputs() {
    for (let key of ['width', 'length', 'area', 'measuredFactor']) {
      this.updateTextboxInput(key)
    }
  }

  updateTextboxInput(key: string) {
    this.textboxInput[key] = String(this.modelData.predictions[key])
      .replace(/,/g, ', ')
  }

  lastEdit: string = 'length'

  onTextboxChange(key: string, newInput: string) {
    this.textboxValid[key] = false

    try {
      if (validateInput(newInput)) {
        this.modelData.predictions[key] = eval('[' + newInput.replace(/[,;\n\t]\s*/g, ', ') + ']')
        this.textboxValid[key] = true

        if (key == 'length' || (key == 'width' && this.lastEdit == 'length')) {
          this.updateAreaFromLength()
          this.updateTextboxInput('area')
          this.lastEdit = 'length'
        }
        if (key == 'area' || (key == 'width' && this.lastEdit == 'area')) {
          this.updateLengthFromArea()
          this.updateTextboxInput('length')
          this.lastEdit = 'area'
        }
        this.updatePredictedFactors()
        this.saveModel()
      }
    }
    catch (err) {
      console.log(err)
    }
  }
}