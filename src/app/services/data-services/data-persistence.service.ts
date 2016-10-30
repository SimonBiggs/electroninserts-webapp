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
          currentSettings.energy = null
          currentSettings.applicator = null
          currentSettings.ssd = null
          currentSettings.machine = null
        }
        else {
          currentSettings = result[0]
        }
        return currentSettings
      })
  }

  saveCurrentSettings(currentSettings: CurrentSettings) {
    console.log('data-persistence.service saveCurrentSettings')
    return db.currentSettings.clear()
      .then(() => {
        console.log('data-persistence.service saveCurrentSettings db.currentSettings.clear() promise complete')
        return db.currentSettings.add(currentSettings)
      })
      .then(() => {
        console.log('data-persistence.service saveCurrentSettings db.currentSettings.add(this.currentSettings) promise complete')
      })
  }

  loadSpecificationsData() {
    console.log('data-persistence.service loadSpecificationsData')
    return db.specification.toArray()
      .then((result: MachineSpecification[]): MachineSpecification[] => {
        console.log('data-persistence.service loadSpecificationsData db.specification.toArray() promise complete')
        if (result.length == 0) {
          let oldSpec = JSON.parse(localStorage.getItem("specifications"))
          let newSpecArray: MachineSpecification[] = []
          
          if (oldSpec != null) {
            let newSpec: MachineSpecification
            let R50: number[]
            for (let machine of Object.keys(oldSpec)) {
              R50 = []
              for (let energy of oldSpec[machine]['energy']) {
                R50.push(oldSpec[machine]['R50'][energy])
              }
              newSpec = {
                machine: machine,
                makeAndModel: oldSpec[machine]['model'],
                energy: oldSpec[machine]['energy'],
                R50: R50,
                applicator: oldSpec[machine]['applicator'],
                ssd: oldSpec[machine]['ssd']
              }
              newSpecArray.push(newSpec)
            }
          }
          return newSpecArray
        }
        else {
          return result
        }        
      })
  }

  saveSpecificationsData(specification: MachineSpecification) {
    console.log('data-persistence.service saveSpecificationsData')
    return db.specification.where('machine').equals(specification.machine).toArray()
      .then((result: MachineSpecification[]) => {
        console.log("data-persistence.service saveSpecificationsData db.specification.where('machine').equals(specification.machine).toArray() promise complete")
        if (result.length == 0) {
          db.specification.add(specification)
            .then(() => {
              console.log("data-persistence.service saveSpecificationsData db.specification.add(specification) promise complete")
            })
        }
        else {
          db.modelData.where('machine').equals(specification.machine).modify({
            makeAndModel: specification.makeAndModel,
            energy: specification.energy,
            R50: specification.R50,
            applicator: specification.applicator,
            ssd: specification.ssd
          })
            .then(() => {
              console.log("data-persistence.service saveSpecificationsData db.modelData.where('machine').equals(specification.machine).modify(...) promise complete")
            })
        }
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
          let parsedData = JSON.parse(localStorage.getItem(storageKey))
          modelData.fillFromObject(parsedData)
        }
        else {
          modelData.fillFromObject(result[0])
        }
      })
  }

  saveModelData(modelData: ModelData, currentSettings: CurrentSettings) {
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
      let localStorageObject = JSON.parse(localStorage.getItem(parameterisation.insertKey))
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