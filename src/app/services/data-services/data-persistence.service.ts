import { Injectable } from '@angular/core';

import Dexie from 'dexie'

import { db } from './dexie.service'

import { ModelData, ModelDataLite } from './model-data'
import { CurrentSettings } from './current-settings'
import { MachineSpecification } from './specifications-data.service'
import { Coordinates, Parameterisation } from './insert-data'


@Injectable()
export class DataPersistenceService {
  loadCurrentSettings() {
    console.log('data-persistence.service loadCurrentSettings')
    let currentSettings = new CurrentSettings()
    return db.currentSettings.toArray()
    .then((result: CurrentSettings[]) => {
      console.log('data-persistence.service loadCurrentSettings db.currentSettings.toArray() promise complete')
      if (result.length == 0) {
        for (let key of ['machine', 'energy', 'applicator', 'ssd']) {
          currentSettings[key] = null
        }
      }
      else {
        currentSettings = result[0]
      }
      // console.log(currentSettings)
      return currentSettings
    })
  }

  saveCurrentSettings(currentSettings: CurrentSettings) {
    console.log('data-persistence.service saveCurrentSettings')
    return db.currentSettings.put(currentSettings)
    .then(() => {
      console.log('data-persistence.service saveCurrentSettings db.currentSettings.put(currentSettings) promise complete')
    })
  }

  loadSpecificationsData() {
    console.log('data-persistence.service loadSpecificationsData')
    return db.specification.toArray()
    .then((result: MachineSpecification[]): MachineSpecification[] => {
      console.log('data-persistence.service loadSpecificationsData db.specification.toArray() promise complete')
      return result
    })
  }

  saveSpecificationsData(specification: MachineSpecification) {
    console.log('data-persistence.service saveSpecificationsData')
    return db.specification.put(specification)
    .then(() => {
      console.log("data-persistence.service saveSpecificationsData db.specification.put(specification) promise complete")
    })
  }

  loadModelData(modelData: ModelData, currentSettings: CurrentSettings) {
    console.log('data-persistence.service loadModelData')
    let storageKey = currentSettings.returnKey()
    modelData.machineSettingsKey = storageKey

    return db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
    .then((result: ModelData[]) => {
      console.log("data-persistence.service loadModelData db.modelData.where('machineSettingsKey').equals(storageKey).toArray() promise complete")
      if (result.length == 0) {
        modelData.fillFromObject({})
      }
      else if (result.length > 1) {
        console.log(result)
        throw new RangeError("Multiple entries found with the same key")
      }
      else {
        modelData.fillFromObject(result[0])
      }
    })
  }

  saveModelData(modelData: ModelData, currentSettings: CurrentSettings) {
    console.log('data-persistence.service saveModelData')
    let storageKey = currentSettings.returnKey()
    modelData.machineSettingsKey = storageKey

    let modelDataLite = modelData.exportLite()

    return db.modelData.where('machineSettingsKey').equals(storageKey).toArray()
      .then((result: ModelDataLite[]) => {
        if (result.length == 0) {
          db.modelData.add(modelDataLite)
        }
        else {
          db.modelData.where('machineSettingsKey').equals(storageKey).modify({
            measurement: modelDataLite.measurement,
            model: modelDataLite.model,
            predictions: modelDataLite.predictions
          })
        }
      })
  }

  loadParameterisationCache(parameterisation: Parameterisation) {
    console.log('data-persistence.service loadParameterisationCache')
    let localStorageObject = JSON.parse(localStorage.getItem(parameterisation.parameterisationKey))
    if (localStorageObject) {
      for (let key of ['circle', 'ellipse']) {
        parameterisation[key] = new Coordinates()
        if (localStorageObject[key]) {
          
          parameterisation[key].x = localStorageObject[key].x
          parameterisation[key].y = localStorageObject[key].y
        }
        else {
          parameterisation[key].x = [0]
          parameterisation[key].y = [0] 
        }
      }
      
      parameterisation.width = localStorageObject['width']
      parameterisation.length = localStorageObject['length']
    }
    else {
      for (let key of ['width', 'length', 'circle', 'ellipse']) {
        parameterisation[key] = null
      }
    }
  }
}