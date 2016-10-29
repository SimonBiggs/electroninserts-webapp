import { Injectable } from '@angular/core';
import { Base } from './base-data'


@Injectable()
export class AreaLengthConversion extends Base {
  public width: number[] = []
  public length: number[] = []
  public area: number[] = []
  public measuredFactor: number[] = []

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

    this.area = []

    for (let i in this.length) {
      width = this.width[i]
      length = this.length[i]

      area = this.convertLengthToArea(width, length)
      this.area.push(area)
    }
  }

  updateLengthFromArea() {
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

  constructor(    
    public measurement: ModelMeasurement,
    public model: ModelGrid,
    public predictions: Predictions
  ) { }

  fillFromObject(object: {}) {
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

  // getCurrentSettings() {

  // }
}

