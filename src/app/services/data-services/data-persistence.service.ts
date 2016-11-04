import { Injectable } from '@angular/core';

// import Dexie from 'dexie'

import { db, PulledFromLocalStorage, ServerURLs } from './dexie.service'

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

    return db.modelData.get(storageKey)
    .then((result: ModelDataLite) => {
      console.log("data-persistence.service loadModelData db.modelData.get(storageKey) promise complete")
      if (result == null) {
        modelData.fillFromObject({})
      }
      else {
        modelData.fillFromObject(result)
      }
    })
  }

  saveModelData(modelData: ModelData, currentSettings: CurrentSettings) {
    console.log('data-persistence.service saveModelData')
    let storageKey = currentSettings.returnKey()
    modelData.machineSettingsKey = storageKey

    let modelDataLite = modelData.exportLite()

    return db.modelData.put(modelDataLite)
    .then(() => {
      console.log("data-persistence.service loadModelData db.modelData.put(modelDataLite) promise complete")
    })
  }

  loadParameterisationCache(parameterisation: Parameterisation) {
    console.log('data-persistence.service loadParameterisationCache')

    return db.parameterisationCache.get(parameterisation.id)
    .then((result: Parameterisation) => {
      console.log("data-persistence.service loadParameterisationCache db.parameterisationCache.get(parameterisation.parameterisationKey) promise complete")
      if (result == null) {
        for (let key of ['width', 'length', 'circle', 'ellipse']) {
          parameterisation[key] = null
        }
      }
      else {
        for (let key of ['width', 'length', 'circle', 'ellipse']) {
          parameterisation[key] = result[key]
        }
      }
    })

    // let localStorageObject = JSON.parse(localStorage.getItem(parameterisation.parameterisationKey))
    // if (localStorageObject) {
    //   for (let key of ['circle', 'ellipse']) {
    //     parameterisation[key] = new Coordinates()
    //     if (localStorageObject[key]) {
          
    //       parameterisation[key].x = localStorageObject[key].x
    //       parameterisation[key].y = localStorageObject[key].y
    //     }
    //     else {
    //       parameterisation[key].x = [0]
    //       parameterisation[key].y = [0] 
    //     }
    //   }
      
    //   parameterisation.width = localStorageObject['width']
    //   parameterisation.length = localStorageObject['length']
    // }
    // else {
    //   for (let key of ['width', 'length', 'circle', 'ellipse']) {
    //     parameterisation[key] = null
    //   }
    // }
  }

  saveParameterisationCache(parameterisation: Parameterisation) {
    console.log('data-persistence.service saveParameterisationCache')
    return db.parameterisationCache.put(parameterisation)
    .then(() => {
      console.log("data-persistence.service saveParameterisationCache db.parameterisationCache.put(parameterisation) promise complete")
    })

    // localStorage.setItem(
    //   JSON.stringify(parameterisation.insert), 
    //   JSON.stringify(parameterisation)
    // )
  }

  loadCurrentInsertData(insertData: InsertData) {
    console.log('data-persistence.service loadCurrentInsertData')
    // This is required because the coodinate inputs to the text boxes are not using ngModel.
    // This work around is brittle.
    let insert = insertData.parameterisation.insert

    // let parameterisation = new Parameterisation()
    // parameterisation.insert = insertData.parameterisation.insert
    // parameterisation.insertUpdated()
    // insertData.parameterisation = parameterisation
    // this.loadParameterisationCache(insertData.parameterisation)

    return db.currentInsertData.get(0)
    .then((result: InsertData) => {
      if (result == null) {
        insertData.reset()
      }
      else {
        insert.x = result.parameterisation.insert.x
        insert.y = result.parameterisation.insert.y

        insertData.fillFromObject(result)
      }

      insertData.parameterisation.insert = insert
    })


    // let localStorageInsertDataString = localStorage['last_insertData']
    // let object = JSON.parse(localStorageInsertDataString)
    // if (object != null) {      
    //   insertData.fillFromObject(object)
    //   this.loadParameterisationCache(insertData.parameterisation)
    // }
  }

  saveCurrentInsertData(insertData: InsertData) {
    console.log('data-persistence.service saveCurrentInsertData')

    return db.currentInsertData.put(insertData)
    .then(() => {
      console.log("data-persistence.service saveCurrentInsertData db.currentInsertData.put(insertData)) promise complete")
    })

    // localStorage.setItem(
    //   "last_insertData", JSON.stringify(insertData))
  }

  loadServerUrl(purpose: string) {
    console.log('data-persistence.service loadServerUrl')

    return db.serverURLs.get(purpose)



    // let url: string
    // if (purpose == 'parameterisation') {
    //   url = localStorage.getItem("parameteriseURL")
    //   if (url == null) {
    //     url = 'http://electronapi.simonbiggs.net/parameterise';
    //   }
    // }

    // if (purpose == 'model') {
    //   url = localStorage.getItem("modelURL")
    //   if (url == null) {
    //     url = 'http://electronapi.simonbiggs.net/model';
    //   }
    // }

    // if (url == null) {
    //   throw new Error("Url was null")
    // }

    // return url

  }

  saveServerUrl(purpose:string, url: string) {
    console.log('data-persistence.service saveServerUrl')
    let serverUrl = new ServerURLs()
    serverUrl.purpose = purpose
    serverUrl.url = url

    return db.serverURLs.put(serverUrl)

    // if (purpose == 'parameterisation') {
    //   localStorage.setItem("parameteriseURL", url)
    // }

    // if (purpose == 'model') {
    //   localStorage.setItem("modelURL", url)
    // }
  }
  
  loadDicomInsertList() {
    console.log('data-persistence.service loadDicomInsertList')

    return db.dicomInsertList.toArray()
    .then((result: InsertData[]): InsertData[] => {
      console.log('data-persistence.service loadDicomInsertList db.dicomInsertList.toArray() promise complete')
      for (let insertData of result) {
        let parameterisation = new Parameterisation()
        parameterisation.insert = insertData.parameterisation.insert
        parameterisation.insertUpdated()
        insertData.parameterisation = parameterisation
        this.loadParameterisationCache(insertData.parameterisation)
      }
      return result
    })
    // let insertList: InsertData[]

    // let insertListString = localStorage.getItem('dicom_insertList')
    // if (insertListString) {
    //   insertList = JSON.parse(insertListString);
    // }
    // else {
    //   insertList = []
    // }
    // return insertList
  }

  saveDicomInsertList(insertList: InsertData[]) {
    console.log('data-persistence.service saveDicomInsertList')
    return db.dicomInsertList.bulkPut(insertList)
    .then(() => {
      console.log('data-persistence.service saveDicomInsertList db.dicomInsertList.bulkPut(insertList) promise complete')
    })

    // localStorage.setItem('dicom_insertList', JSON.stringify(insertList));
  }

  jsonTransform(input: {}): string {
    console.log('data-persistence.service jsonTransform')
    let jsonText = JSON.stringify(input, null, 2)
    jsonText = jsonText.replace(/,\s*(-?\d+(\.\d+)?)/g, ", $1");
    jsonText = jsonText.replace(/\n/g, "\n  ");

    return jsonText
  }

  databaseDump() {
    console.log('data-persistence.service databaseDump')
    let schemaString = ""
    let tablesString = ""
    let tableDumps: {} = {}
    let stringDump = ""
    let promiseList: any[] = []

    db.tables.forEach((table, i) => {
      let primKeyAndIndexes = [table.schema.primKey].concat(table.schema.indexes)
      let schemaSyntax = primKeyAndIndexes.map(function (index) { return index.src; }).join(', ')
      schemaString = schemaString.concat(`
` + "      \"" + table.name + "\": " + "\"" +
        schemaSyntax + "\"" + (i < db.tables.length - 1 ? "," : ""))

      tableDumps[table.name] = {}
      promiseList.push(table.toArray((objectArray) => {
        tableDumps[table.name] = objectArray
      }))
    })

    return Promise.all(promiseList)
    .then(() => {
        stringDump = `{
  "databaseDetails": {
    "name": "` + db.name +`",
    "version": ` + db.verno + `,
    "schema": {` + schemaString + `
    }
  },
  "databaseContents": ` + this.jsonTransform(tableDumps) + `
}`
        // console.log(stringDump)
        return stringDump
      })
  }

  emptyDatabase() {
    console.log('data-persistence.service emptyDatabase')
    let promiseList: any[] = []
    let pulledFromLocalStorage: PulledFromLocalStorage
    db.tables.forEach((table, i) => {
      promiseList.push(table.clear())
    })

    return Promise.all(promiseList)
    .then(() => {
      pulledFromLocalStorage = {
        id: 0,
        pulledFromLocalStorage: true
      }
      return db.pulledFromLocalStorage.add(pulledFromLocalStorage)
    })
  }

  appendJsonToDatabase(object: {}) {
    console.log('data-persistence.service appendJsonToDatabase')
    let promiseList: any[] = []
    let databaseContents = object['databaseContents']
    db.tables.forEach((table, i) => {
      promiseList.push(table.bulkPut(databaseContents[table.name]))
    })
    return Promise.all(promiseList)
  }
}