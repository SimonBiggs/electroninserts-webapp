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

  specifications: MachineSpecification[]
  currentSpecification: MachineSpecification

  dataPersistenceService = new DataPersistenceService()

  constructor(
    public currentSettings: CurrentSettings
  ) {

  }

  returnMachineSpecification(machineID: string) {
    let machineSpecification: MachineSpecification
    let index: number

    index = this.specifications.findIndex((specification: MachineSpecification) => {
      return specification.machine == machineID
    })
    if (index == -1) {
      machineSpecification = null
    }
    else {
      machineSpecification = this.specifications[index]
    }

    return machineSpecification
  }

  returnCurrentR50(energyLookup: number) {
    let index: number
    index = this.currentSpecification.energy.indexOf(energyLookup)
    if (index == -1) {
      throw new RangeError("Requested energy is not within the current specification")
    }
    return this.currentSpecification.R50[index]
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

    let machineSpecification: MachineSpecification
    machineSpecification = this.returnMachineSpecification(this.currentSettings.machine)

    if (machineSpecification == null) {      
      this.currentSpecification = this.specifications[0]
      this.currentSettings.machine = this.machineList[0]
      this.refreshCurrentSettings()
    }
    else {
      this.currentSpecification = machineSpecification
    }

    // console.warn(this.currentIndex)
    // console.warn(this.specifications)
    // console.warn(this.currentSpecification)
  }

  refreshCurrentSettings() {
    console.log('specifications-data.service refreshCurrentSettings')
    if (this.currentSpecification != null) {
      for (let item of ["energy", "applicator", "ssd"]) {
        if (this.currentSpecification[item] == null) {
          this.currentSettings[item] = null
        }
        else {
          if (this.currentSpecification[item].length > 0) {
            this.currentSettings[item] = this.currentSpecification[item][0]
          }
          else {
            this.currentSettings[item] = null
          }
        }
      }
    }
    else {
      for (let item of ["energy", "applicator", "ssd"]) {
        this.currentSettings[item] = null
      }
    }
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
  }

  newMachine(newMachineID: string, newMakeAndModel: string) {
    console.log('specifications-data.service newMachine')
    if (this.machineList.indexOf(newMachineID) != -1) {
      throw new RangeError("This 'new' machine already exists")
    }
    let newSpecification = new MachineSpecification()
    newSpecification.machine = newMachineID
    newSpecification.makeAndModel = newMakeAndModel
    this.specifications.push(newSpecification)
    this.updateMachineList()
    this.changeMachine(newMachineID)
  }

  changeMachine(swapToMachineID: string) {
    console.log('specifications-data.service changeMachine')
    this.currentSettings.machine = swapToMachineID
    this.refreshCurrentSettings()
    this.updateCurrentSpecification()
  }
}