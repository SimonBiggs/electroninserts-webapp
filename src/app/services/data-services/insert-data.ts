import { Injectable } from '@angular/core';
import { Base } from './base-data'

import { DataPersistenceService } from '../../services/data-services/data-persistence.service'


@Injectable()
export class Coordinates {
  public x: number[]
  public y: number[]
}

@Injectable()
export class Parameterisation {
  public insertKey: string
  public width: number
  public length: number

  insert = new Coordinates()
  circle = new Coordinates()
  ellipse = new Coordinates()

  dataPersistenceService = new DataPersistenceService()

  constructor() {
    for (let key of ['x', 'y']) {
      if (this.insert[key] === undefined) {
        this.insert[key] = [0]
      }
    }
  }

  insertUpdated() {
    if (this.insert != null) {
      
      this.insertKey = (
        '{"x":' + JSON.stringify(this.insert.x) + ',' +
        '"y":' + JSON.stringify(this.insert.y) +
        '}')

      this.dataPersistenceService.loadParameterisationCache(this)
    }
    else {
      throw new RangeError('Insert was not defined. Cannot run insert updated.')
    }

  }

  reset() {
    this.insertKey = null

    for (let key of ['insert', 'circle', 'ellipse']) {
      this[key] = new Coordinates()
      this[key].x = [0]
      this[key].y = [0]
    }

    this.width = null
    this.length = null
  }
}

@Injectable()
export class InsertData {
  public machine: string
  public energy: number
  public applicator: string
  public ssd: number
  public measuredFactor: number

  parameterisation = new Parameterisation()

  reset() {
    this.machine = null
    this.parameterisation.reset()
    this.energy = null
    this.applicator = null
    this.ssd = null
    this.measuredFactor = null
  }

  fillFromObject(object: {}) {
    for (let key of ['machine', 'energy', 'applicator', 'ssd', 'measuredFactor']) {
      this[key] = object[key]
    }
    this.parameterisation.insert = object['parameterisation'].insert
    this.parameterisation.insertUpdated()
  }
}
