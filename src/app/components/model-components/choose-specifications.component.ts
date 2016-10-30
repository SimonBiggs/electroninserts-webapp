import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { CurrentSettings } from '../../services/data-services/current-settings'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { MachineSpecification, MachineSpecificationsService } from '../../services/data-services/specifications-data.service'


@Component({
  selector: 'my-choose-specifications',
  templateUrl: './choose-specifications.component.html'
})
export class ChooseSpecificationsComponent implements OnInit {
  @Output()
  settingsUpdated = new EventEmitter()

  currentSettings: CurrentSettings

  constructor(
    private dataPersistenceService: DataPersistenceService,
    private machineSpecificationService: MachineSpecificationsService
  ) { }
 
  ngOnInit() {
    console.log('choose-specifications.component ngOnInit')
    this.machineSpecificationService.loadData()
      .then(() => {
        this.currentSettings = this.machineSpecificationService.currentSettings
        this.settingsUpdated.emit(this.currentSettings)
      })
  }

  updateMachineID(newCurrentMachine: string) {
    console.log('choose-specifications.component updateMachineID')
    this.currentSettings.machine = newCurrentMachine
    this.machineSpecificationService.updateCurrentSpecification()
    this.machineSpecificationService.refreshCurrentSettings()

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
