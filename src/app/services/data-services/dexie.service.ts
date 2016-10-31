import Dexie from 'dexie'

import { ModelData, ModelDataLite } from './model-data'
import { MachineSpecification } from './specifications-data.service'
import { CurrentSettings } from './current-settings'
import { InsertData, Parameterisation } from './insert-data'


export class DexieDatabase extends Dexie {
  
  pulledFromLocalStorage: Dexie.Table<PulledFromLocalStorage, number>
  modelData: Dexie.Table<ModelDataLite, string>
  specification: Dexie.Table<MachineSpecification, string>
  currentSettings: Dexie.Table<CurrentSettings, number>
  parameterisationCache: Dexie.Table<Parameterisation, string>
  currentInsert: Dexie.Table<InsertData, number>
  // serverURLs: Dexie.Table<>

  constructor() {
    super("DefaultDatabase")
    let db = this
    // db.delete()

    db.version(1).stores({
      pulledFromLocalStorage: 'id, pulledFromLocalStorage',
      modelData: 'machineSettingsKey, measurement, model, predictions',
      specification: 'machine, makeAndModel, energy, R50, applicator, ssd',
      currentSettings: 'id, machine, energy, applicator, ssd',
      parameterisationCache: 'parameterisationKey, insert, width, length, circle, ellipse',
      currentInsert: 'id, machine, parameterisation, energy, applicator, ssd, measuredFactor'
    })

    db.modelData.mapToClass(ModelData)
    db.specification.mapToClass(MachineSpecification)
    db.currentSettings.mapToClass(CurrentSettings)
    // db.parameterisationCache.mapToClass(Parameterisation)
    // db.currentInsert.mapToClass(InsertData)

    db.pulledFromLocalStorage.toArray()
      .then((result: PulledFromLocalStorage[]) => {
        if (result[0] == null) {
          this.fillDatabaseFromLocalStorage()
        }
        else if(result[0].pulledFromLocalStorage == false) {
          this.fillDatabaseFromLocalStorage()
        }
      })
  }

  fillDatabaseFromLocalStorage() {
    console.log('dexie.service fillDatabaseFromLocalStorage')
    let specifications = this.loadSpecificationsFromLocalStorage()
    let modelDataLiteArray = this.loadModelDataFromLocalStorage(specifications)


    db.specification.bulkAdd(specifications)
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

export class PulledFromLocalStorage {
  id: number
  pulledFromLocalStorage: boolean
}

