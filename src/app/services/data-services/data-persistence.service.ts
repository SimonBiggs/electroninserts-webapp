import { Injectable } from '@angular/core';

import Dexie from 'dexie'

import { ModelData } from './model-data'
import { db } from './dexie.service'


@Injectable()
export class DataPersistenceService {
  createStorageKey(currentSettings: {machine: string, energy: number, applicator: string, ssd: number}) {
    let storageKey = (
      '{"machine":' + JSON.stringify(String(currentSettings.machine)) + ',' +
      '"energy":' + JSON.stringify(Number(currentSettings.energy)) + ',' +
      '"applicator":' + JSON.stringify(String(currentSettings.applicator)) + ',' +
      '"ssd":' + JSON.stringify(Number(currentSettings.ssd)) +
      '}')

    return storageKey
  }

  loadModelData(modelData: ModelData, currentSettings: {machine: string, energy: number, applicator: string, ssd: number}) {
    let storageKey = this.createStorageKey(currentSettings)

    modelData.machineSettingsKey = this.createStorageKey(currentSettings)

    return db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
      .then((result) => {
        if (result.length == 0) {
          let parsedData = JSON.parse(localStorage.getItem(storageKey))
          modelData.fillFromObject(parsedData)
          db.modelData.add(modelData)
        }
        else {
          modelData.fillFromObject(result[0])
        }
      })
  }

  saveModelData(modelData: ModelData, currentSettings: {machine: string, energy: number, applicator: string, ssd: number}) {
    let storageKey = this.createStorageKey(currentSettings)
    // localStorage.setItem(storageKey, JSON.stringify(modelData))

    modelData.machineSettingsKey = this.createStorageKey(currentSettings)

    db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
      .then((result) => {
        if (result.length == 0) {
          db.modelData.add(modelData)
        }
        else {
          db.modelData.where('machineSettingsKey').equals(storageKey).modify({
            measurement: modelData.measurement,
            model: modelData.model,
            predictions: modelData.predictions
          })
        }
      })
  }
}