import Dexie from 'dexie'

import { ModelData, ModelDataLite } from './model-data'
import { MachineSpecification } from './specifications-data.service'
import { CurrentSettings } from './current-settings'
import { InsertData, Parameterisation } from './insert-data'

export class DexieDatabase extends Dexie {
  
  modelData: Dexie.Table<ModelDataLite, number>
  specification: Dexie.Table<MachineSpecification, number>
  currentSettings: Dexie.Table<CurrentSettings, number>
  parameterisationCache: Dexie.Table<Parameterisation, number>
  currentInsert: Dexie.Table<InsertData, number>

  constructor() {
    super("DefaultDatabase")
    let db = this
    // db.delete()
    db.version(1).stores({
      modelData: 'machineSettingsKey, measurement, model, predictions',
      specification: 'machine, makeAndModel, energy, R50, applicator, ssd',
      currentSettings: 'machine, energy, applicator, ssd',
      parameterisationCache: 'parameterisationKey, insert, width, length, circle, ellipse',
      currentInsert: 'machine, parameterisation, energy, applicator, ssd, measuredFactor'
    })

    db.modelData.mapToClass(ModelData)
    db.specification.mapToClass(MachineSpecification)
    db.currentSettings.mapToClass(CurrentSettings)
    // db.parameterisationCache.mapToClass(Parameterisation)
    // db.currentInsert.mapToClass(InsertData)
  }
}

export let db = new DexieDatabase()