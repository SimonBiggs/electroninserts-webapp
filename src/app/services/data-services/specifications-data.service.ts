import { Injectable } from '@angular/core';

import { CurrentSettings } from './current-settings'
import { DataPersistenceService } from './data-persistence.service'

@Injectable()
export class MachineSpecification {
  machine: string
  makeAndModel: string
  energy: number[]
  R50: number[]
  applicator: string[]
  ssd: number[]
}

@Injectable()
export class MachineSpecificationsService {
  machineList: string[]  
  currentIndex: number

  specifications: MachineSpecification[]
  currentSpecification: MachineSpecification

  dataPersistenceService = new DataPersistenceService()

  constructor(
    public currentSettings: CurrentSettings
  ) {

  }

  loadData() {
    console.log('specifications-data.service loadData')
    return this.dataPersistenceService.loadCurrentSettings()
      .then((currentSettings: CurrentSettings) => {
        console.log('specifications-data.service loadData this.dataPersistenceService.loadCurrentSettings() promise complete')
        this.currentSettings = currentSettings
        return this.dataPersistenceService.loadSpecificationsData()
      })
      .then((specificationArray: MachineSpecification[]) => {
        console.log('specifications-data.service loadData this.dataPersistenceService.loadSpecificationsData() promise complete')
        this.specifications = specificationArray
        this.updateSpecifications()
      })
  }

  updateSpecifications() {
    console.log('specifications-data.service updateSpecifications')
    if (this.specifications == null) {
      this.specifications = []
      this.machineList = []
    }
    else {
      this.updateMachineList()
      this.updateCurrentSpecification()     
    }
  }

  updateMachineList() {
    console.log('specifications-data.service updateMachineList')
    this.machineList = []
    for (let specification of this.specifications) {
      this.machineList.push(specification.machine)
    }
  }

  updateCurrentSpecification() {
    console.log('specifications-data.service updateCurrentSpecification')
    this.currentIndex = this.specifications.findIndex((specification: MachineSpecification) => {
      return specification.machine == this.currentSettings.machine
    })
    if (this.currentIndex == -1) {
      this.currentIndex = 0
      this.currentSettings.machine = this.machineList[0]
      this.currentSpecification = this.specifications[0]
      this.refreshCurrentSettings()
    }
    else {
      this.currentSpecification = this.specifications[this.currentIndex]
    }

    // console.warn(this.currentIndex)
    // console.warn(this.specifications)
    // console.warn(this.currentSpecification)
  }

  refreshCurrentSettings() {
    console.log('specifications-data.service resetCurrentSettings')
    if (this.currentSpecification != null) {
      for (let item of ["energy", "applicator", "ssd"]) {
        if (this.currentSpecification[item].length > 0) {
          this.currentSettings[item] = this.currentSpecification[item][0]
        }
        else {
          this.currentSettings[item] = null
        }
      }
    }
    else {
      for (let item of ["energy", "applicator", "ssd"]) {
        this.currentSettings[item] = null
      }
    }
  }

}