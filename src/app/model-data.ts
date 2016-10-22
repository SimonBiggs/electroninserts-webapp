import { Injectable } from '@angular/core';

export class Base {
  public propNames: string[]

  reset() {
    for (let propName of this.propNames) {
      this[propName] = null
    }
  }

  fillFromObject(object: {}) {
    for (let propName in object) {
      if (this.propNames.indexOf(propName) > -1) {
        this[propName] = object[propName]
      }
    }
    for (let propName of this.propNames) {
      if (object[propName] == null) {
        this[propName] = null
      }
    }
  }
}

@Injectable()
export class ModelMeasurement extends Base {
  public propNames: string[] = ['width', 'length', 'measured_factor']
  public width: number[] = []
  public length: number[] = []
  public measured_factor: number[] = []
}

@Injectable()
export class ModelGrid extends Base  {
  public propNames: string[] = ['width', 'length', 'predicted_factor']
  public width: number[] = []
  public length: number[] = []
  public predicted_factor: number[] = []
}

@Injectable()
export class Predictions extends Base {
  public propNames: string[] = ['width', 'length', 'area', 'measured_factor', 'predicted_factor']
  public width: number[] = []
  public length: number[] = []
  public area: number[] = []
  public measured_factor: number[] = []
  public predicted_factor: number[] = []
}

@Injectable()
export class ModelData {
  constructor(
    public measurement: ModelMeasurement,
    public model: ModelGrid,
    public predictions: Predictions
  ) { }
}