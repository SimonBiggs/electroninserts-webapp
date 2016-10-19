import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

import { TitleService } from './title.service'
import { ElectronApiService } from './electron-api.service';

@Component({
  selector: 'my-model',
  templateUrl: './model.component.html'
})
export class ModelComponent implements OnInit {
  modelData = {
      measurement: {
        width: <number[]> [],
        length: <number[]> [],
        factor: <number[]> [],
      },
      model: {
        width: <number[]> [],
        length: <number[]> [],
        factor: <number[]> []
      }
  };

  initialMeasurementWidth: string = "";
  initialMeasurementLength: string = "";
  initialMeasurementFactor: string = "";

  emptyData = {
    width: <number[]> [],
    length: <number[]> [],
    factor: <number[]> []
  }
  modelURL: string;
  plot_width = 600;

  machineSpecifications: {}
  machineList: string[]
  currentMachine: string
  currentEnergy: number
  currentApplicator: string
  currentSSD: number

  dataInFlight: boolean = false

  lengthSmallerThanWidth: boolean = false

  @ViewChild('plotContainer') plotContainer: any;

  constructor(
    private myTitleService: TitleService,
    private electronApiService: ElectronApiService,
    ngZone: NgZone
  ) {
    window.onresize = (e) =>
    {
        ngZone.run(() => {
            this.plot_width = this.plotContainer.nativeElement.clientWidth;
        });
    };
  }
 
  ngOnInit() {
    this.myTitleService.setTitle('Model');

    this.modelURL = localStorage.getItem("modelURL")
    if (this.modelURL == null) {
      this.modelURL = 'http://electronapi.simonbiggs.net/model';
    }
    this.plot_width = this.plotContainer.nativeElement.clientWidth;
    this.updateInitialMeasurementValues()

    this.currentEnergy = JSON.parse(localStorage.getItem("currentEnergy"))
    this.currentApplicator = JSON.parse(localStorage.getItem("currentApplicator"))
    this.currentSSD = JSON.parse(localStorage.getItem("currentSSD"))

    this.machineSpecifications = JSON.parse(localStorage.getItem("specifications"));
    if (this.machineSpecifications == null) {
      this.machineSpecifications = {};
      this.machineList = [];
    }
    else {
      this.machineList = Object.keys(this.machineSpecifications).sort();
      this.currentMachine = JSON.parse(localStorage.getItem("current_machine"));
      if (
          this.currentMachine == null || 
          this.machineSpecifications[this.currentMachine] === undefined) {
        this.currentMachine = this.machineList[0];
      }
    }

    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
  }

  createKey() {
    let key = (
      '{"machine":' + JSON.stringify(String(this.currentMachine)) + ',' +
      '"energy":' + JSON.stringify(Number(this.currentEnergy)) + ',' +
      '"applicator":' + JSON.stringify(String(this.currentApplicator)) + ',' +
      '"ssd":' + JSON.stringify(Number(this.currentSSD)) +
      '}')
    return key
  }

  loadMeasuredData() {
    let key = this.createKey()
    // console.log(JSON.parse(key))
    this.modelData = JSON.parse(localStorage.getItem(key))
    if (this.modelData == null) {
      this.modelData = {
        measurement: {
          width: <number[]> [],
          length: <number[]> [],
          factor: <number[]> [],
        },
        model: {
          width: <number[]> [],
          length: <number[]> [],
          factor: <number[]> []
        }
      }
    }
    this.updateInitialMeasurementValues()
  }

  saveModel() {
    let key = this.createKey()
    localStorage.setItem(key, JSON.stringify(this.modelData))    
  }

  updateInitialMeasurementValues() {
    this.initialMeasurementWidth = String(this.modelData.measurement.width)
      .replace(/,/g,', ')
    this.initialMeasurementLength = String(this.modelData.measurement.length)
      .replace(/,/g,', ')
    this.initialMeasurementFactor = String(this.modelData.measurement.factor)
      .replace(/,/g,', ')
  }

  updateMachineID(newCurrentMachine: string) {
    this.currentMachine = newCurrentMachine
    localStorage.setItem("current_machine", JSON.stringify(newCurrentMachine))
    if (newCurrentMachine in this.machineSpecifications) {
      if (this.machineSpecifications[newCurrentMachine].energy.length > 0) {
        this.currentEnergy = this.machineSpecifications[newCurrentMachine].energy[0]
      }
      else {
        this.currentEnergy = null
      }
      if (this.machineSpecifications[newCurrentMachine].applicator.length > 0) {
        this.currentApplicator = this.machineSpecifications[newCurrentMachine].applicator[0]
      }
      else {
        this.currentApplicator = null
      }
      if (this.machineSpecifications[newCurrentMachine].ssd.length > 0) {
        this.currentSSD = this.machineSpecifications[newCurrentMachine].ssd[0]
      }
      else {
        this.currentSSD = null
      }
    }
    else {
      this.currentEnergy = null
      this.currentApplicator = null
      this.currentSSD = null
    }

    localStorage.setItem("currentEnergy", JSON.stringify(Number(this.currentEnergy)))
    localStorage.setItem("currentApplicator", JSON.stringify(this.currentApplicator))
    localStorage.setItem("currentSSD", JSON.stringify(Number(this.currentSSD)))

    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
  }

  updateEnergy(newCurrentEnergy: number) {
    this.currentEnergy = Number(newCurrentEnergy)
    localStorage.setItem("currentEnergy", JSON.stringify(Number(newCurrentEnergy)))

    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
  }

  updateApplicator(newCurrentApplicator: string) {
    this.currentApplicator = newCurrentApplicator
    localStorage.setItem("currentApplicator", JSON.stringify(newCurrentApplicator))

    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
  }

  updateSSD(newCurrentSSD: number) {
    this.currentSSD = Number(newCurrentSSD)
    localStorage.setItem("currentSSD", JSON.stringify(Number(newCurrentSSD)))

    this.loadMeasuredData()
    this.checkLengthSmallerThanWidth()
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

  widthInputValid: boolean = true
  updateMeasurementWidth(widthInput: string) {
    this.widthInputValid = false
    this.modelData.model = {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    }
    try {
      if (this.validateInput(widthInput)) {
        this.modelData.measurement.width = eval('[' + widthInput.replace(/[,;\s]+/g,', ') + ']')
        this.saveModel()
        this.widthInputValid = true
        this.checkLengthSmallerThanWidth()
      }
    }
    catch(err) {
      console.log(err)
    }  
  }

  lengthInputValid: boolean = true
  updateMeasurementLength(lengthInput: string) {
    this.lengthInputValid = false
    this.modelData.model = {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    }
    try {
      if (this.validateInput(lengthInput)) {
        this.modelData.measurement.length = eval('[' + lengthInput.replace(/[,;\s]+/g,', ')  + ']')
        this.saveModel()
        this.lengthInputValid = true
        this.checkLengthSmallerThanWidth()
      }
    }
    catch(err) {
      console.log(err)
    }  
  }

  factorInputValid: boolean = true
  updateMeasurementFactor(factorInput: string) {
    this.factorInputValid = false
    this.modelData.model = {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    }
    try {
      if (this.validateInput(factorInput)) {
        this.modelData.measurement.factor = eval('[' + factorInput.replace(/[,;\s]+/g,', ')  + ']')
        this.saveModel()
        this.factorInputValid = true
      }
    }
    catch(err) {
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

  jsonInputUpdated(jsonInput: any) {
    this.modelData = jsonInput;
  }

  modelServerChange(newModelURL: string) {
    localStorage.setItem("modelURL", newModelURL);
  }

  defaultServer() {
    this.modelURL = 'http://electronapi.simonbiggs.net/model';
    localStorage.setItem("modelURL", this.modelURL);
  }

  loadDemoData() {
    this.currentMachine = null
    this.currentEnergy = null
    this.currentApplicator = null
    this.currentSSD = null

    this.modelData.model = {
      width: <number[]> [],
      length: <number[]> [],
      factor: <number[]> []
    }

    this.modelData.measurement.width = [    
      3.71,  6.78,  6.3 ,  7.56,  5.26,  6.53,  7.08,  4.38,  3.66,
      4.21,  4.21,  6.54,  5.86,  3.17,  6.  ,  8.06,  6.31,  5.26,
      4.21,  5.21,  4.59,  5.34,  6.41,  5.26,  5.25,  7.82,  4.2 ,
      3.16,  7.18,  5.72,  6.08,  6.64,  8.4 ,  4.59,  3.15,  4.67,
      4.21,  9.45,  7.64,  3.17,  3.17,  7.36]
    this.modelData.measurement.length = [
      4.36,  10.97,   6.33,  10.05,  13.66,  10.99,  10.77,   5.47,
      5.04,   8.41,  13.65,   8.41,   8.62,   9.43,   7.97,  11.85,
      8.24,  10.52,   6.82,  11.4 ,   5.67,   9.64,   8.69,   8.41,
      5.26,  10.85,   4.21,   5.25,  11.27,  11.6 ,   6.64,   9.81,
      8.42,   6.54,   3.16,   6.28,  10.51,   9.47,   8.99,  13.64,
      6.83,   7.37]
    this.modelData.measurement.factor = [
      0.9489,  1.0067,  0.9858,  1.0045,  0.9868,  1.0004,  1.0052,
      0.9634,  0.9437,  0.9708,  0.9757,  0.9931,  0.9896,  0.9492,
      0.9911,  1.0067,  0.9923,  0.9879,  0.9609,  0.9884,  0.9587,
      0.9934,  0.9991,  0.9831,  0.9705,  1.0019,  0.9562,  0.9348,
      0.9987,  0.9989,  0.9933,  0.9991,  1.0067,  0.9683,  0.9296,
      0.9735,  0.9709,  1.0084,  1.0028,  0.953 ,  0.9484,  1.0032]

    this.updateInitialMeasurementValues()
  }

}
