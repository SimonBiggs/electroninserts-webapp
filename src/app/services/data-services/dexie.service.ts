import Dexie from 'dexie'

import { ModelData, ModelDataLite } from './model-data'
import { MachineSpecification } from './specifications-data'
import { CurrentSettings } from './current-settings'

export class DexieDatabase extends Dexie {
  
  modelData: Dexie.Table<ModelDataLite, number>
  specification: Dexie.Table<MachineSpecification, number>
  currentSettings: Dexie.Table<CurrentSettings, number>

  constructor() {
    super("DefaultDatabase")
    let db = this
    // db.delete()
    db.version(1).stores({
      modelData: 'machineSettingsKey, measurement, model, predictions',
      specification: 'machine, makeAndModel, energy, R50, applicator, ssd',
      currentSettings: 'machine, energy, applicator, ssd'
    })

    db.modelData.mapToClass(ModelData)
    db.specification.mapToClass(MachineSpecification)
    db.currentSettings.mapToClass(CurrentSettings)
  }
}

export let db = new DexieDatabase()