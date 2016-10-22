import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

import { TitleService } from './title.service'
import { ElectronApiService } from './electron-api.service';

@Component({
  selector: 'my-create-model',
  templateUrl: './create-model.component.html'
})
export class CreateModelComponent implements OnInit {
  modelData = {
    measurement: {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    },
    model: {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    },
    predictions: {
      width: <number[]> [],
      length: <number[]> [],
      area: <number[]> [],
      measured_factor: <number[]> [],
      predicted_factor: <number[]> []
    }
  }

  textboxInput = {
    width: <string>null,
    length: <string>null,
    factor: <string>null
  }

  textboxLabels = {
    width: "Equivalent ellipse widths (cm @iso)",
    length: "Equivalent ellipse lengths (cm @iso)",
    factor: "Measured insert factor (as per TG 25)"
  }

  textboxValid = {
    width: true,
    length: true,
    factor: true
  }

  currentSettings = {
    machine: <string>null,
    energy: <number>null,
    applicator: <string>null,
    ssd: <number>null
  }

  lengthSmallerThanWidth: boolean = false
  
  plot_width = 600

  modelURL: string
  dataInFlight: boolean = false



  @ViewChild('plotContainer') plotContainer: any
  @ViewChild('settingsPicker') settingsPicker: any

  constructor(
    private myTitleService: TitleService,
    private electronApiService: ElectronApiService,
    ngZone: NgZone
  ) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.updatePlotWidth()
      })
    }
  }

  ngOnInit() {
    this.myTitleService.setTitle('Create Model')

    this.modelURL = localStorage.getItem("modelURL")
    if (this.modelURL == null) {
      this.modelURL = 'http://electronapi.simonbiggs.net/model'
    }
    this.updatePlotWidth()

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

  createKey() {
    let key = (
      '{"machine":' + JSON.stringify(String(this.currentSettings.machine)) + ',' +
      '"energy":' + JSON.stringify(Number(this.currentSettings.energy)) + ',' +
      '"applicator":' + JSON.stringify(String(this.currentSettings.applicator)) + ',' +
      '"ssd":' + JSON.stringify(Number(this.currentSettings.ssd)) +
      '}')

    return key
  }

  loadMeasuredData() {
    let key = this.createKey()
    let parsedData = JSON.parse(localStorage.getItem(key))

    for (let item of ['measurement', 'model']) {
      if (parsedData[item] == null) {
        this.modelData[item] = {
          width: <number[]> [],
          length: <number[]> [],
          factor: <number[]> []
        }
      }
      else {
        this.modelData[item] = parsedData[item]
      }
    }

    if (parsedData['predictions'] == null) {
      this.modelData['predictions'] = {
        width: <number[]> [],
        length: <number[]> [],
        area: <number[]> [],
        measured_factor: <number[]> [],
        predicted_factor: <number[]> []
      }
    }
    else {
      this.modelData['predictions'] = parsedData['predictions']
    }
    this.updateTextboxInput()
  }

  saveModel() {
    let key = this.createKey()
    localStorage.setItem(key, JSON.stringify(this.modelData))
  }

  updateTextboxInput() {
    for (let key of ['width', 'length', 'factor']) {
      this.textboxInput[key] = String(this.modelData.measurement[key])
        .replace(/,/g, ', ')
    }
  }

  checkLengthSmallerThanWidth() {
    this.lengthSmallerThanWidth = false
    for (let i = 0; i < this.modelData.measurement.width.length; i++) {
      if (this.modelData.measurement.width[i] > this.modelData.measurement.length[i]) {
        this.lengthSmallerThanWidth = true
        return
      }
    }
  }

  validateInput(input: string): boolean {
    return /^(-?\d*(\.\d+)?[,;\s]+)*-?\d*(\.\d+)?[,;\s]*$/.test(input)
  }

  onTextboxChange(key: string, newInput: string) {
    this.textboxValid[key] = false
    this.modelData.model = {
      width: <number[]>[],
      length: <number[]>[],
      factor: <number[]>[]
    }

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

  basicServerSubmit() {
    this.dataInFlight = true
    this.electronApiService.sendToServer(
      this.modelURL,
      JSON.stringify(this.modelData.measurement)
    )
      .then((modelResult: any) => {
        this.modelData.model.width = modelResult.model_width;
        this.modelData.model.length = modelResult.model_length;
        this.modelData.model.factor = modelResult.model_factor;
        this.dataInFlight = false
        this.saveModel()
      })
  }

  modelServerChange(newModelURL: string) {
    localStorage.setItem("modelURL", newModelURL);
  }

  defaultServer() {
    this.modelURL = 'http://electronapi.simonbiggs.net/model';
    localStorage.setItem("modelURL", this.modelURL);
  }

  loadDemoData() {
    for (let key of ['machine', 'energy', 'applicator', 'ssd']) {
      this.currentSettings[key] = null
    }

    this.settingsPicker.currentSettings = this.currentSettings

    this.modelData.model = {
      width: <number[]>[],
      length: <number[]>[],
      factor: <number[]>[]
    }

    this.modelData.measurement.width = [
      3.71, 6.78, 6.3, 7.56, 5.26, 6.53, 7.08, 4.38, 3.66,
      4.21, 4.21, 6.54, 5.86, 3.17, 6., 8.06, 6.31, 5.26,
      4.21, 5.21, 4.59, 5.34, 6.41, 5.26, 5.25, 7.82, 4.2,
      3.16, 7.18, 5.72, 6.08, 6.64, 8.4, 4.59, 3.15, 4.67,
      4.21, 9.45, 7.64, 3.17, 3.17, 7.36]
    this.modelData.measurement.length = [
      4.36, 10.97, 6.33, 10.05, 13.66, 10.99, 10.77, 5.47,
      5.04, 8.41, 13.65, 8.41, 8.62, 9.43, 7.97, 11.85,
      8.24, 10.52, 6.82, 11.4, 5.67, 9.64, 8.69, 8.41,
      5.26, 10.85, 4.21, 5.25, 11.27, 11.6, 6.64, 9.81,
      8.42, 6.54, 3.16, 6.28, 10.51, 9.47, 8.99, 13.64,
      6.83, 7.37]
    this.modelData.measurement.factor = [
      0.9489, 1.0067, 0.9858, 1.0045, 0.9868, 1.0004, 1.0052,
      0.9634, 0.9437, 0.9708, 0.9757, 0.9931, 0.9896, 0.9492,
      0.9911, 1.0067, 0.9923, 0.9879, 0.9609, 0.9884, 0.9587,
      0.9934, 0.9991, 0.9831, 0.9705, 1.0019, 0.9562, 0.9348,
      0.9987, 0.9989, 0.9933, 0.9991, 1.0067, 0.9683, 0.9296,
      0.9735, 0.9709, 1.0084, 1.0028, 0.953, 0.9484, 1.0032]

    this.updateTextboxInput()
  }

}
