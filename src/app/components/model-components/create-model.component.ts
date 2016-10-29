import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'
import { ElectronApiService } from '../../services/server-api-services/electron-api.service';
import { ModelData } from '../../services/data-services/model-data'

import { WidthLengthAreaInputComponent } from './width-length-area-input.component'

@Component({
  selector: 'my-create-model',
  templateUrl: './create-model.component.html'
})
export class CreateModelComponent implements OnInit, OnDestroy{
  textboxLabels = {
    width: "Width of ellipse given by diameter of largest encompassed circle (cm @iso)",
    length: "Length of ellipse that matches insert shape area (cm @iso)",
    area: "[Optional] Area of insert shape (cm^2 @iso)",
    measuredFactor: "Measured insert factor (as per TG 25)"
  }

  textboxValid = true  

  currentSettings = {
    machine: <string> null,
    energy: <number> null,
    applicator: <string> null,
    ssd: <number> null
  }

  lengthSmallerThanWidth: boolean = false
  
  plot_width = 600

  modelURL: string
  dataInFlight: boolean = false

  @ViewChild('plotContainer') plotContainer: any
  @ViewChild('settingsPicker') settingsPicker: any
  @ViewChild('textboxInputs') textboxInputs: WidthLengthAreaInputComponent

  constructor(
    private modelData: ModelData,
    private myTitleService: TitleService,
    private electronApiService: ElectronApiService,
    private ngZone: NgZone
  ) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.updatePlotWidth()
      })
    }
  }

  ngOnDestroy() {
    window.onresize = null;
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

  loadMeasuredData() {
    this.modelData.loadModelData(this.currentSettings)
    this.textboxInputs.triggerUpdate = true
  }

  saveModel() {
    this.modelData.saveModelData(this.currentSettings)
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

  onValidTextboxChange() {
    this.modelData.model.reset()
    this.checkLengthSmallerThanWidth()
    this.saveModel()
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
        this.modelData.model.predictedFactor = modelResult.model_factor;
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

    this.modelData.model.reset()
    this.modelData.measurement.reset()

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
    this.modelData.measurement.measuredFactor = [
      0.9489, 1.0067, 0.9858, 1.0045, 0.9868, 1.0004, 1.0052,
      0.9634, 0.9437, 0.9708, 0.9757, 0.9931, 0.9896, 0.9492,
      0.9911, 1.0067, 0.9923, 0.9879, 0.9609, 0.9884, 0.9587,
      0.9934, 0.9991, 0.9831, 0.9705, 1.0019, 0.9562, 0.9348,
      0.9987, 0.9989, 0.9933, 0.9991, 1.0067, 0.9683, 0.9296,
      0.9735, 0.9709, 1.0084, 1.0028, 0.953, 0.9484, 1.0032]

    this.modelData.measurement.updateAreaFromLength()
    
    this.checkLengthSmallerThanWidth()
    this.textboxInputs.triggerUpdate = true
  }

}
