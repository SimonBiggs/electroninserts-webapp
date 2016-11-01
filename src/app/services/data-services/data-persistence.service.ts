import { Injectable } from '@angular/core';

import Dexie from 'dexie'

import { db } from './dexie.service'

import { ModelData, ModelDataLite } from './model-data'
import { CurrentSettings } from './current-settings'
import { MachineSpecification } from './specifications-data.service'
import { Coordinates, Parameterisation, InsertData } from './insert-data'


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
    return db.specifications.toArray()
    .then((result: MachineSpecification[]): MachineSpecification[] => {
      console.log('data-persistence.service loadSpecificationsData db.specifications.toArray() promise complete')
      return result
    })
  }

  saveSpecificationsData(specification: MachineSpecification) {
    console.log('data-persistence.service saveSpecificationsData')
    return db.specifications.put(specification)
    .then(() => {
      console.log("data-persistence.service saveSpecificationsData db.specifications.put(specification) promise complete")
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

  saveParameterisationCache(parameterisation: Parameterisation) {
    localStorage.setItem(
      JSON.stringify(parameterisation.insert), 
      JSON.stringify(parameterisation)
    )
  }

  loadCurrentInsertData(insertData: InsertData) {
    let localStorageInsertDataString = localStorage['last_insertData']
    let object = JSON.parse(localStorageInsertDataString)
    if (object != null) {      
      insertData.fillFromObject(object)
      this.loadParameterisationCache(insertData.parameterisation)
    }
  }

  saveCurrentInsertData(insertData: InsertData) {
    localStorage.setItem(
      "last_insertData", JSON.stringify(insertData))
  }

  loadServerUrl(purpose: string) {
    let url: string
    if (purpose == 'parameterisation') {
      url = localStorage.getItem("parameteriseURL")
      if (url == null) {
        url = 'http://electronapi.simonbiggs.net/parameterise';
      }
    }

    if (purpose == 'model') {
      url = localStorage.getItem("modelURL")
      if (url == null) {
        url = 'http://electronapi.simonbiggs.net/model';
      }
    }

    if (url == null) {
      throw new Error("Url was null")
    }

    return url

  }

  saveServerUrl(purpose:string, url: string) {
    if (purpose == 'parameterisation') {
      localStorage.setItem("parameteriseURL", url)
    }

    if (purpose == 'model') {
      localStorage.setItem("modelURL", url)
    }
  }
  
  loadDicomInsertList() {
    let insertList: InsertData[]

    let insertListString = localStorage.getItem('dicom_insertList')
    if (insertListString) {
      insertList = JSON.parse(insertListString);
    }
    else {
      insertList = []
    }
    return insertList
  }

  saveDicomInsertList(insertList: InsertData[]) {
    localStorage.setItem('dicom_insertList', JSON.stringify(insertList));
  }

}