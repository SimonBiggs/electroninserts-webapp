import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { CurrentSettings } from '../../services/data-services/current-settings'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { MachineSpecification, MachineSpecificationsUtility } from '../../services/data-services/specifications-data'


@Component({
  selector: 'my-choose-specifications',
  templateUrl: './choose-specifications.component.html'
})
export class ChooseSpecificationsComponent implements OnInit {
  machineSpecificationUtility: MachineSpecificationsUtility

  @Output()
  settingsUpdated = new EventEmitter()

  constructor(
    private dataPersistenceService: DataPersistenceService,
    private currentSettings: CurrentSettings
  ) { }
 
  ngOnInit() {
    console.log('choose-specifications.component ngOnInit')
    this.dataPersistenceService.loadCurrentSettings().then((currentSettings: CurrentSettings) => {
      this.currentSettings = currentSettings
      // console.log(currentSettings)
      return this.dataPersistenceService.loadSpecificationsData()
    }).then((specificationArray: MachineSpecification[]) => {
      this.machineSpecificationUtility = new MachineSpecificationsUtility(specificationArray, this.currentSettings)
      console.log(this.machineSpecificationUtility)
      this.settingsUpdated.emit(this.machineSpecificationUtility.currentSpecification)
    })
  }

  updateMachineID(newCurrentMachine: string) {
    console.log('choose-specifications.component updateMachineID')
    this.currentSettings.machine = newCurrentMachine
    this.machineSpecificationUtility.updateCurrentSpecification()
    this.machineSpecificationUtility.resetCurrentSettings()

    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
    this.settingsUpdated.emit(this.currentSettings)
  }

  updateEnergy(newCurrentEnergy: number) {
    console.log('choose-specifications.component updateEnergy')
    this.currentSettings.energy = Number(newCurrentEnergy)
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateApplicator(newCurrentApplicator: string) {
    console.log('choose-specifications.component updateApplicator')
    this.currentSettings.applicator = newCurrentApplicator
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateSSD(newCurrentSSD: number) {
    console.log('choose-specifications.component updateSSD')
    this.currentSettings.ssd = Number(newCurrentSSD)
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)

    this.settingsUpdated.emit(this.currentSettings)
  }
}
