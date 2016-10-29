import Dexie from 'dexie'

import { ModelData } from './model-data'

export class DexieDatabase extends Dexie {
  
  modelData: Dexie.Table<ModelData, number>

  constructor() {
    super("DefaultDatabase")
    let db = this

    db.version(1).stores({
      modelData: 'machineSettingsKey, measurement, model, predictions'
    })

    db.modelData.mapToClass(ModelData)
  }
}

export let db = new DexieDatabase()