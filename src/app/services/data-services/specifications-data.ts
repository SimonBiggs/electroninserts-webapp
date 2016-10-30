import { Injectable } from '@angular/core';

import { CurrentSettings } from './current-settings'

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
export class MachineSpecificationsUtility {
  machineList: string[]  
  currentSpecification: MachineSpecification
  currentIndex: number

  constructor (
    public specifications: MachineSpecification[], 
    public currentSettings: CurrentSettings
  ) 
  {
    this.updateSpecifications()
  }

  updateSpecifications() {
    if (this.specifications == null) {
      this.specifications = []
      this.machineList = []
    }
    else {
      this.updateMachineList()
      this.updateCurrentSpecification()     
    }
  }

  updateCurrentSpecification() {
    this.currentIndex = this.specifications.findIndex((specification: MachineSpecification) => {
      return specification.machine == this.currentSettings.machine
    })
    this.currentSpecification = this.specifications[this.currentIndex]

    if (
        this.currentSettings.machine == null || 
        this.currentSpecification === undefined) {
      this.currentSettings.machine = this.machineList[0]
    }
  }

  updateMachineList() {
    this.machineList = []
    for (let specification of this.specifications) {
      this.machineList.push(specification.machine)
    }
  }

  resetCurrentSettings() {
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