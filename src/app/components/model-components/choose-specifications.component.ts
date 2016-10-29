import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { CurrentSettings } from '../../services/data-services/current-settings'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { MachineSpecification } from '../../services/data-services/specifications-data'


@Component({
  selector: 'my-choose-specifications',
  templateUrl: './choose-specifications.component.html'
})
export class ChooseSpecificationsComponent implements OnInit {
  machineList: string[]
  allMachineSpecifications: MachineSpecification[]
  currentMachineSpecifications: MachineSpecification

  currentIndex: number

  

  @Output()
  settingsUpdated = new EventEmitter()

  constructor(
    private dataPersistenceService: DataPersistenceService,
    private currentSettings: CurrentSettings
  ) { }
 
  ngOnInit() {
    this.dataPersistenceService.loadCurrentSettings().then((currentSettings: CurrentSettings) => {
      this.currentSettings = currentSettings
      // console.log(currentSettings)
      return this.dataPersistenceService.loadSpecificationsData()
    }).then((specificationArray: MachineSpecification[]) => {
      this.allMachineSpecifications = specificationArray
      if (this.allMachineSpecifications == null) {
        this.allMachineSpecifications = []
        this.machineList = []
      }
      else {
        this.currentIndex = this.allMachineSpecifications.findIndex((specification: MachineSpecification) => {
          return specification.machine == this.currentSettings.machine
        })
        this.currentMachineSpecifications = this.allMachineSpecifications[this.currentIndex]

        this.machineList = []
        for (let specification of specificationArray) {
          this.machineList.push(specification.machine)
        }
        if (
            this.currentSettings.machine == null || 
            this.currentMachineSpecifications === undefined) {
          this.currentSettings.machine = this.machineList[0]
        }

      }
      
      this.settingsUpdated.emit(this.currentSettings)
    })


  }

  updateMachineID(newCurrentMachine: string) {
    this.currentSettings.machine = newCurrentMachine
    this.currentIndex = this.allMachineSpecifications.findIndex((specification: MachineSpecification) => {
      return specification.machine == this.currentSettings.machine
    })
    this.currentMachineSpecifications = this.allMachineSpecifications[this.currentIndex]

    if (this.currentMachineSpecifications != null) {
      for (let item of ["energy", "applicator", "ssd"]) {
        if (this.currentMachineSpecifications[item].length > 0) {
          this.currentSettings[item] = this.currentMachineSpecifications[item][0]
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

    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
    this.settingsUpdated.emit(this.currentSettings)
  }

  updateEnergy(newCurrentEnergy: number) {
    this.currentSettings.energy = Number(newCurrentEnergy)
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateApplicator(newCurrentApplicator: string) {
    this.currentSettings.applicator = newCurrentApplicator
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateSSD(newCurrentSSD: number) {
    this.currentSettings.ssd = Number(newCurrentSSD)
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }
}
