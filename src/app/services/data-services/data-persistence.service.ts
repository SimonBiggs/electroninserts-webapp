import { Injectable } from '@angular/core';

import Dexie from 'dexie'

import { db } from './dexie.service'

import { ModelData, ModelDataLite } from './model-data'
import { CurrentSettings } from './current-settings'
import { MachineSpecification } from './specifications-data'


@Injectable()
export class DataPersistenceService {

  constructor(
    private currentSettings: CurrentSettings
  ) { }

  loadCurrentSettings(currentSettings: CurrentSettings) {
    return db.currentSettings.toArray()
      .then((result: CurrentSettings[]) => {
        if (result.length == 0) {
          try {
            currentSettings.energy = JSON.parse(localStorage.getItem("currentEnergy"))
            currentSettings.applicator = JSON.parse(localStorage.getItem("currentApplicator"))
            currentSettings.ssd = JSON.parse(localStorage.getItem("currentSSD"))
            currentSettings.machine = String(JSON.parse(localStorage.getItem("current_machine")))
          }
          catch(err){}      
        }
        else {
          for (let key of Object.keys(result[0])) {
            currentSettings[key] = result[0][key]
          }
        }
      })
  }

  saveCurrentSettings(currentSettings: CurrentSettings) {
    return db.currentSettings.clear()
      .then(() => {
        db.currentSettings.add(this.currentSettings)
      })
  }

  loadSpecificationsData() {
    return db.specification.toArray()
      .then((result: MachineSpecification[]): MachineSpecification[] => {
        if (result.length == 0) {
          let oldSpec = JSON.parse(localStorage.getItem("specifications"))
          let newSpecArray: MachineSpecification[] = []
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
          return newSpecArray
        }
        else {
          return result
        }        
      })    
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
}