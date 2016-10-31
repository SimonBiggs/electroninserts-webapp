import { Injectable } from '@angular/core';
import { Base } from './base-data'
import { CurrentSettings } from './current-settings'


@Injectable()
export class AreaLengthConversion extends Base {
  public width: number[] = []
  public length: number[] = []
  public area: number[] = []
  public measuredFactor: number[] = []

  convertLengthToArea(width: number, length: number): number {
    console.log('model.data AreaLengthConversion convertLengthToArea')
    let area = Math.PI * width * length / 4
    return Math.round(area*10)/10
  }

  convertAreaToLength(width: number, area: number): number {
    console.log('model.data AreaLengthConversion convertAreaToLength')
    let length = 4 * area / (Math.PI * width)
    return Math.round(length*10)/10
  }

  updateAreaFromLength() {
    console.log('model.data AreaLengthConversion updateAreaFromLength')
    let width: number
    let length: number
    let area: number

    this.area = []

    for (let i in this.length) {
      width = this.width[i]
      length = this.length[i]

      area = this.convertLengthToArea(width, length)
      this.area.push(area)
    }
  }

  updateLengthFromArea() {
    console.log('model.data AreaLengthConversion updateLengthFromArea')
    let width: number
    let length: number
    let area: number

    this.length = []

    for (let i in this.area) {
      width = this.width[i]
      area = this.area[i]

      length = this.convertAreaToLength(width, area)
      this.length.push(length)
    }
  }

  initialLengthAreaUpdate() {
    console.log('model.data AreaLengthConversion initialLengthAreaUpdate')
    if (this.length.length < this.area.length) {
      this.updateLengthFromArea()
    }
    else {
      this.updateAreaFromLength()
    }
  }
}

@Injectable()
export class ModelMeasurement extends AreaLengthConversion {
  protected propNames: string[] = ['width', 'length', 'area', 'measuredFactor']
  protected keyConversions: {} = {
    'factor': 'measuredFactor'
  }
  
}

@Injectable()
export class ModelGrid extends Base  {
  protected propNames: string[] = ['width', 'length', 'predictedFactor']
  protected keyConversions: {} = {
    'factor': 'predictedFactor'
  }
  public width: number[] = []
  public length: number[] = []
  public predictedFactor: number[] = []
}

@Injectable()
export class Predictions extends AreaLengthConversion {
  protected propNames: string[] = ['width', 'length', 'area', 'measuredFactor', 'predictedFactor']
  public predictedFactor: number[] = []
}

@Injectable()
export class ModelData {
  protected propNames: string[] = ['measurement', 'model', 'predictions']
  public machineSettingsKey: string
  public measurement: ModelMeasurement
  public model: ModelGrid
  public predictions: Predictions

  constructor() {
    this.measurement = new ModelMeasurement()
    this.model = new ModelGrid()
    this.predictions = new Predictions()
  }

  fillFromObject(object: {}) {
    console.log('model.data ModelData fillFromObject')
    if (object == null) {
      for (let propName of this.propNames) {
        this[propName].reset()
      }
    }
    else {
      for (let propName of this.propNames) {
        if (object[propName] == null) {
          this[propName].reset()
        }
        else {
          this[propName].fillFromObject(object[propName])
        }
      }
    }
    this.measurement.initialLengthAreaUpdate()
    this.predictions.initialLengthAreaUpdate()
  }

  updateKey(currentSettings: CurrentSettings) {
    this.machineSettingsKey = currentSettings.returnKey()
  }

  exportLite(): ModelDataLite {
    console.log('model.data ModelData exportLite')
    let modelDataLite = <ModelDataLite>{
      machineSettingsKey: this.machineSettingsKey,
      measurement: {
        width: this.measurement.width,
        length: this.measurement.length,
        measuredFactor: this.measurement.measuredFactor
      },
      model: {
        width: this.model.width,
        length: this.model.length,
        predictedFactor: this.model.predictedFactor
      },
      predictions: {
        width: this.predictions.width,
        length: this.predictions.length,
        measuredFactor: this.predictions.measuredFactor,
        predictedFactor: this.predictions.predictedFactor
      }
    }
    return modelDataLite
  }
}

export interface ModelDataLite {
  machineSettingsKey: string
  measurement: {
    width: number[],
    length: number[],
    measuredFactor: number[]
  }
  model: {
    width: number[],
    length: number[],
    predictedFactor: number[]
  }
  predictions: {
    width: number[],
    length: number[],
    measuredFactor: number[],
    predictedFactor: number[]
  }
}