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

  constructor(
    private dataPersistenceService: DataPersistenceService,
    private machineSpecificationService: MachineSpecificationsService
  ) { }
 
  ngOnInit() {
    console.log('choose-specifications.component ngOnInit')
    this.machineSpecificationService.loadData()
      .then(() => {
        this.settingsUpdated.emit(this.machineSpecificationService.currentSettings)
      })
  }

  updateMachineID(newCurrentMachine: string) {
    console.log('choose-specifications.component updateMachineID')
    this.machineSpecificationService.currentSettings.machine = newCurrentMachine
    this.machineSpecificationService.updateCurrentSpecification()
    this.machineSpecificationService.refreshCurrentSettings()

    this.dataPersistenceService.saveCurrentSettings(this.machineSpecificationService.currentSettings)
    this.settingsUpdated.emit(this.machineSpecificationService.currentSettings)
  }

  updateEnergy(newCurrentEnergy: number) {
    console.log('choose-specifications.component updateEnergy')
    this.machineSpecificationService.currentSettings.energy = Number(newCurrentEnergy)
    this.dataPersistenceService.saveCurrentSettings(this.machineSpecificationService.currentSettings)

    this.settingsUpdated.emit(this.machineSpecificationService.currentSettings)
  }

  updateApplicator(newCurrentApplicator: string) {
    console.log('choose-specifications.component updateApplicator')
    this.machineSpecificationService.currentSettings.applicator = newCurrentApplicator
    this.dataPersistenceService.saveCurrentSettings(this.machineSpecificationService.currentSettings)

    this.settingsUpdated.emit(this.machineSpecificationService.currentSettings)
  }

  updateSSD(newCurrentSSD: number) {
    console.log('choose-specifications.component updateSSD')
    this.machineSpecificationService.currentSettings.ssd = Number(newCurrentSSD)
    this.dataPersistenceService.saveCurrentSettings(this.machineSpecificationService.currentSettings)

    this.settingsUpdated.emit(this.machineSpecificationService.currentSettings)
  }
}
