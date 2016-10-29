import { Injectable } from '@angular/core';

import Dexie from 'dexie'

import { ModelData } from './model-data'
import { CurrentSettings } from './current-settings'
import { db } from './dexie.service'


@Injectable()
export class DataPersistenceService {  
  loadSpecificationsData() {

  }

  saveSpecificationsData() {

  }

  loadModelData(modelData: ModelData, currentSettings: CurrentSettings) {
    let storageKey = currentSettings.returnKey()
    modelData.machineSettingsKey = storageKey

    return db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
      .then((result: ModelData[]) => {
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

  saveModelData(modelData: ModelData, currentSettings: CurrentSettings) {
    let storageKey = currentSettings.returnKey()
    modelData.machineSettingsKey = storageKey

    return db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
      .then((result: ModelData[]) => {
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