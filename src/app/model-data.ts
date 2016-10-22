import { Injectable } from '@angular/core';

export class Base {
  public propNames: string[]
  public keyConversions: {}

  reset() {
    for (let propName of this.propNames) {
      this[propName] = []
    }
  }

  fillFromObject(object: {}) {
    object = this.updateOldKeyNames(object)
    for (let propName of this.propNames) {
      if (object[propName] == null) {
        this[propName] = []
      }
      else {
        this[propName] = object[propName]
      }
    }
  }

  updateOldKeyNames(object: {}) {
    let newKey: string

    for (let oldKey in this.keyConversions) {
      if (object[oldKey] != null && object[this.keyConversions[oldKey]] == null) {
        newKey = this.keyConversions[oldKey]
        Object.defineProperty(object, newKey,
            Object.getOwnPropertyDescriptor(object, oldKey));
        delete object[oldKey];
      }
    }

    return object
  }
}

@Injectable()
export class ModelMeasurement extends Base {
  public propNames: string[] = ['width', 'length', 'measuredFactor']
  public keyConversions: {} = {
    'factor': 'measuredFactor'
  }
  public width: number[] = []
  public length: number[] = []
  public measuredFactor: number[] = []
}

@Injectable()
export class ModelGrid extends Base  {
  public propNames: string[] = ['width', 'length', 'predictedFactor']
  public keyConversions: {} = {
    'factor': 'predictedFactor'
  }
  public width: number[] = []
  public length: number[] = []
  public predictedFactor: number[] = []
}

@Injectable()
export class Predictions extends Base {
  public propNames: string[] = ['width', 'length', 'area', 'measuredFactor', 'predictedFactor']
  public width: number[] = []
  public length: number[] = []
  public area: number[] = []
  public measuredFactor: number[] = []
  public predictedFactor: number[] = []
}

@Injectable()
export class ModelData {
  public propNames: string[] = ['measurement', 'model', 'predictions']

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

  }
}