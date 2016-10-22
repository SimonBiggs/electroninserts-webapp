import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { TitleService } from './title.service'
import { ModelData } from './model-data'

@Component({
  selector: 'my-use-model',
  templateUrl: './use-model.component.html'
})
export class UseModelComponent {
  textboxInput = {
    width: <string> null,
    length: <string> null,
    area: <string> null,
    factor: <string> null
  }

  textboxLabels = {
    width: "Width of ellipse given by diameter of largest encompassed circle (cm @iso)",
    length: "Length of ellipse that matches insert shape in area (cm @iso)",
    area: "Area of insert shape (cm^2 @iso)",
    factor: "Measured insert factor (as per TG 25)"
  }

  textboxValid = {
    width: true,
    length: true,
    area: true,
    factor: true
  }

  currentSettings = {
    machine: <string> null,
    energy: <number> null,
    applicator: <string> null,
    ssd: <number> null
  }

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
    this.myTitleService.setTitle('Use Model');
  }

  convertLengthToArea(width: number, length: number): number {
    let area = Math.PI * width * length / 4
    return area
  }

  convertAreaToLength(width: number, area: number): number {
    let length = 4 * area / (Math.PI * width)
    return length
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

  updatePlotWidth() {
    this.plot_width = this.plotContainer.nativeElement.clientWidth
  }

  currentMachineSettingsUpdated(newSettings: {}) {
    for (let key of ['machine', 'energy', 'applicator', 'ssd']) {
      this.currentSettings[key] = newSettings[key]
    }
    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
  }

  createLocalStorageKey() {
    let localStorageKey = (
      '{"machine":' + JSON.stringify(String(this.currentSettings.machine)) + ',' +
      '"energy":' + JSON.stringify(Number(this.currentSettings.energy)) + ',' +
      '"applicator":' + JSON.stringify(String(this.currentSettings.applicator)) + ',' +
      '"ssd":' + JSON.stringify(Number(this.currentSettings.ssd)) +
      '}')

    return localStorageKey
  }

  loadMeasuredData() {
    let localStorageKey = this.createLocalStorageKey()
    let parsedData = JSON.parse(localStorage.getItem(localStorageKey))

    this.modelData.fillFromObject(parsedData)

    this.updateAllTextboxInputs()
  }

  saveModel() {
    let localStorageKey = this.createLocalStorageKey()
    localStorage.setItem(localStorageKey, JSON.stringify(this.modelData))
  }

  updateAllTextboxInputs() {
    for (let key of ['width', 'length', 'area', 'factor']) {
      this.updateTextboxInput(key)
    }
  }

  updateTextboxInput(key: string) {
    this.textboxInput[key] = String(this.modelData.measurement[key])
      .replace(/,/g, ', ')
  }

  checkLengthSmallerThanWidth() {
    this.lengthSmallerThanWidth = false
    for (let i in this.modelData.measurement.width) {
      if (this.modelData.measurement.width[i] > this.modelData.measurement.length[i]) {
        this.lengthSmallerThanWidth = true
        return
      }
    }
  }

  validateInput(input: string): boolean {
    // return /^(-?\d*(\.\d+)?[,;\s]+)*-?\d*(\.\d+)?[,;\s]*$/.test(input)
    return /^[-\d\.,;\s]*$/.test(input)
  }

  onTextboxChange(key: string, newInput: string) {
    this.textboxValid[key] = false
    this.modelData.model.reset()

    try {
      if (this.validateInput(newInput)) {
        this.modelData.measurement[key] = eval('[' + newInput.replace(/[,;\s]+/g, ', ') + ']')
        this.saveModel()
        this.textboxValid[key] = true
        this.checkLengthSmallerThanWidth()
      }
    }
    catch (err) {
      console.log(err)
    }
  }
}