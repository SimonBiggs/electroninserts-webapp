import Dexie from 'dexie'

import { InsertData, Parameterisation } from './insert-data'
import { ModelData, ModelDataLite } from './model-data'
import { MachineSpecification } from './specifications-data.service'
import { CurrentSettings } from './current-settings'


export class PulledFromLocalStorage {
  id: number
  pulledFromLocalStorage: boolean
}


export class ServerURLs {
  purpose: string
  url: string
}


export class DexieDatabase extends Dexie {  
  pulledFromLocalStorage: Dexie.Table<PulledFromLocalStorage, number>
  modelData: Dexie.Table<ModelDataLite, string>
  specifications: Dexie.Table<MachineSpecification, string>
  currentSettings: Dexie.Table<CurrentSettings, number>
  parameterisationCache: Dexie.Table<Parameterisation, number>
  currentInsertData: Dexie.Table<InsertData, number>
  serverURLs: Dexie.Table<ServerURLs, string>
  dicomInsertList: Dexie.Table<InsertData, number>

  constructor() {
    super("DefaultDatabase")
    let db = this
    // db.delete()

    db.version(1).stores({
      specifications: 'machine, makeAndModel, energy, R50, applicator, ssd',
      currentSettings: 'id, machine, energy, applicator, ssd',
      currentInsertData: 'id, machine, parameterisation, energy, applicator, ssd, measuredFactor',      
      modelData: 'machineSettingsKey, measurement, model, predictions',
      dicomInsertList: 'id, machine, parameterisation, energy, applicator, ssd, measuredFactor',
      serverURLs: 'purpose, url',
      parameterisationCache: 'id, insert, width, length, circle, ellipse',
      pulledFromLocalStorage: 'id, pulledFromLocalStorage'
    })

    db.pulledFromLocalStorage.mapToClass(PulledFromLocalStorage)
    db.modelData.mapToClass(ModelData)
    db.specifications.mapToClass(MachineSpecification)
    db.currentSettings.mapToClass(CurrentSettings)
    db.parameterisationCache.mapToClass(Parameterisation)
    db.currentInsertData.mapToClass(InsertData)
    db.serverURLs.mapToClass(ServerURLs)
    db.dicomInsertList.mapToClass(InsertData)
    

    db.pulledFromLocalStorage.toArray()
      .then((result: PulledFromLocalStorage[]) => {
        if (result[0] == null) {
          this.fillDatabaseFromLocalStorage()
        }
        else if(result[0].pulledFromLocalStorage == false) {
          db.specifications.clear()
          db.modelData.clear()          
          this.fillDatabaseFromLocalStorage()
        }
      })
  }

  fillDatabaseFromLocalStorage() {
    console.log('dexie.service fillDatabaseFromLocalStorage')
    let specifications = this.loadSpecificationsFromLocalStorage()
    let machineList: string[] = []
    for (let specification of specifications) {
      machineList.push(specification.machine)
    }
    machineList.sort()
    for (let i = 0; i < machineList.length - 1; i++) {
      if (machineList[i] == machineList[i+1]) {
        console.log(machineList)
        throw new RangeError("Local storage specifications contain duplicate Machine IDs")
      }
    }

    let modelDataLiteArray = this.loadModelDataFromLocalStorage(specifications)
    let machineSettingsKeys: string[] = []
    for (let modelDataLite of modelDataLiteArray) {
      machineSettingsKeys.push(modelDataLite.machineSettingsKey)
    }
    machineSettingsKeys.sort()
    for (let i = 0; i < machineSettingsKeys.length - 1; i++) {
      if (machineSettingsKeys[i] == machineSettingsKeys[i+1]) {
        throw new RangeError("Local storage specifications contain duplicate models")
      }
    }

    db.specifications.bulkAdd(specifications)
    .then(() => {
      console.log('dexie.service fillDatabaseFromLocalStorage db.specification.bulkAdd(specifications) promise complete')
      return db.modelData.bulkAdd(modelDataLiteArray)
    })
    .then(() => {
      console.log('dexie.service fillDatabaseFromLocalStorage db.modelData.bulkAdd(modelDataLiteArray) promise complete')
      let pulledFromLocalStorage: PulledFromLocalStorage = {
        id: 0,
        pulledFromLocalStorage: true
      }
      db.pulledFromLocalStorage.add(pulledFromLocalStorage)
    })
  }

  testArrayOfStrings(input: string[]) {
    console.log('dexie.service testArrayOfStrings')
    if (input instanceof Array) {
      input.forEach(function(item){
        if(typeof item !== 'string'){
          return false
        }
      })
      return true
    }
    else {
      return false
    }
  }

  testArrayOfNumbers(input: number[]) {
    console.log('dexie.service testArrayOfNumbers')
    if (input instanceof Array) {
      input.forEach(function(item){
        if(typeof item !== 'number'){
          return false
        }
      })
      return true
    }
    else {
      return false
    }
  }

  loadSpecificationsFromLocalStorage() {
    console.log('dexie.service loadSpecificationsFromLocalStorage')
    let oldSpec = JSON.parse(localStorage.getItem("specifications"))
    let newSpec: MachineSpecification
    let newSpecArray: MachineSpecification[] = []

    let makeAndModel: string
    let energy: number[]
    let R50: number[]
    let applicator: string[]
    let ssd: number[]
    
    if (oldSpec != null) {
      for (let machine of Object.keys(oldSpec)) {
        makeAndModel = oldSpec[machine]['model']
        energy = oldSpec[machine]['energy']
        R50 = []
        for (let energy of oldSpec[machine]['energy']) {
          R50.push(oldSpec[machine]['R50'][energy])
        }
        applicator = oldSpec[machine]['applicator']
        ssd = oldSpec[machine]['ssd']

        if (makeAndModel !== undefined && typeof makeAndModel !== "string") {
          console.log(makeAndModel)
          throw new RangeError("Loaded makeAndModel type was not string")
        }

        if (energy !== undefined && !this.testArrayOfNumbers(energy)) {
          console.log(energy)
          throw new RangeError("Loaded energy type was not number[]")
        }

        if (R50 !== undefined && !this.testArrayOfNumbers(R50)) {
          console.log(R50)
          throw new RangeError("Loaded energy type was not number[]")
        }

        if (applicator !== undefined && !this.testArrayOfStrings(applicator)) {
          console.log(applicator)
          throw new RangeError("Loaded applicator type was not string[]")
        }

        if (ssd !== undefined && !this.testArrayOfNumbers(ssd)) {
          console.log(ssd)
          throw new RangeError("Loaded ssd type was not number[]")
        }
        
        newSpec = {
          machine: machine,
          makeAndModel: makeAndModel,
          energy: energy,
          R50: R50,
          applicator: applicator,
          ssd: ssd
        }
        newSpecArray.push(newSpec)
      }
    }
    return newSpecArray
  }

  loadModelDataFromLocalStorage(specificationsArray: MachineSpecification[]) {
    console.log('dexie.service loadModelDataFromLocalStorage')
    let modelData: ModelData
    let modelDataLiteArray: ModelDataLite[] = []
    let currentSettings = new CurrentSettings()

    for (let specification of specificationsArray) {
      currentSettings.machine = specification.machine
      for (let energy of specification.energy) {
        currentSettings.energy = energy
        for (let applicator of specification.applicator) {
          currentSettings.applicator = applicator
          for (let ssd of specification.ssd) {
            currentSettings.ssd = ssd
            let parsedData = JSON.parse(localStorage.getItem(currentSettings.returnKey()))
            if (parsedData != null) {
              modelData = new ModelData()
              modelData.fillFromObject(parsedData)
              modelData.updateKey(currentSettings)
              modelDataLiteArray.push(modelData.exportLite())
            }
          }
        }
      }
    }
    return modelDataLiteArray
  }
}



export let db = new DexieDatabase()