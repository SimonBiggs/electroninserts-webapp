import { Component, OnInit } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'

import { CurrentSettings } from '../../services/data-services/current-settings'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'
import { MachineSpecification, MachineSpecificationsService } from '../../services/data-services/specifications-data.service'


@Component({
  selector: 'my-specifications',
  templateUrl: './specifications.component.html'
})
export class SpecificationsComponent implements OnInit {
  newMachineID: string;
  newMachineIDValid: boolean = false;
  newModel: string;
  newModelValid: boolean = false;
  newMachineValid: boolean = false;
  edittingMachine: string = null;

  newEnergy: number;
  newEnergyValid: boolean = false;
  newR50: number;
  newR50Valid: boolean = false;
  newEnergySetValid: boolean = false;
  edittingEnergy: string = null;

  newApplicator: string;
  newApplicatorValid: boolean = false;
  edittingApplicator: string = null;

  newSSD: number;
  newSSDValid: boolean = false;
  edittingSSD: string = null;

  currentSettings: CurrentSettings

  constructor(
    private myTitleService: TitleService,
    private dataPersistenceService: DataPersistenceService,
    private machineSpecificationService: MachineSpecificationsService
  ) {}


  ngOnInit() {
    console.log('specifications.component ngOnInit')
    this.myTitleService.setTitle('Specifications');
    this.machineSpecificationService.loadData()
      .then(() => {
        console.log('specifications.component ngOnInit this.machineSpecificationService.loadData() promise complete')
        this.currentSettings = this.machineSpecificationService.currentSettings
      })
  }


  checkNewMachineIDInput() {
    console.log('specifications.component checkNewMachineIDInput')
    if (
      this.machineSpecificationService.machineList.indexOf(this.newMachineID) == -1 && 
      this.newMachineID != null && this.newMachineID != ""
    ) {
      this.newMachineIDValid = true;
    }
    else {
      this.newMachineIDValid = false;
    }

    this.checkNewMachineValid()
  }

  checkNewModelInput() {
    console.log('specifications.component checkNewModelInput')
    if (this.newModel != null && this.newModel != "") {
      this.newModelValid = true;
    }
    else {
      this.newModelValid = false;
    }

    this.checkNewMachineValid()
  }

  checkNewMachineValid() {
    console.log('specifications.component checkNewMachineValid')
    this.newMachineValid = (this.newMachineIDValid && this.newModelValid);
  }

  addMachineID() {
    console.log('specifications.component addMachineID')
    if (!this.newMachineValid) {
      throw new RangeError('The new machine being added is not a valid input')
    }
    this.machineSpecificationService.newMachine(this.newMachineID)

    this.newMachineID = null
    this.newModel = null
    this.newMachineIDValid = false
    this.newModelValid = false
    this.newMachineValid = false

    this.dataPersistenceService.saveSpecificationsData(this.machineSpecificationService.currentSpecification)
  }

  checkNewEnergyInput() {
    console.log('specifications.component checkNewEnergyInput')
    if (
      this.machineSpecificationService.currentSpecification.energy.indexOf(Number(this.newEnergy)) < 0 && 
      this.newEnergy != null && !isNaN(Number(this.newEnergy))
    ) {
      this.newEnergyValid = true;
    }
    else {
      this.newEnergyValid = false;
    }

    this.checkNewEnergySetValid()
  }

  checkNewR50Input() {
    console.log('specifications.component checkNewR50Input')
    if (this.newR50 != null && !isNaN(Number(this.newR50))) {
      this.newR50Valid = true;
    }
    else {
      this.newR50Valid = false;
    }

    this.checkNewEnergySetValid()
  }

  checkNewEnergySetValid() {
    console.log('specifications.component checkNewEnergySetValid')
    this.newEnergySetValid = (this.newEnergyValid && this.newR50Valid);
  }

  addEnergy() {
    console.log('specifications.component addEnergy')
    if (!this.newEnergySetValid) {
      throw new RangeError('The new energy set being added is not valid')
    }
    this.machineSpecificationService.currentSpecification.energy.push(Number(this.newEnergy))
    this.machineSpecificationService.currentSpecification.R50.push(Number(this.newR50))

    this.newEnergy = null
    this.newR50 = null
    this.newEnergyValid = false
    this.newR50Valid = false
    this.newEnergySetValid = false

    this.dataPersistenceService.saveSpecificationsData(this.machineSpecificationService.currentSpecification)


  }

  checkNewApplicatorInput() {
    console.log('specifications.component checkNewApplicatorInput')
    if (
      this.machineSpecificationService.currentSpecification.applicator.indexOf(this.newApplicator.toLowerCase()) < 0 && 
      this.newApplicator != null && this.newApplicator != ""
    ) {
      this.newApplicatorValid = true
    }
    else {
      this.newApplicatorValid = false
    }
  }

  addApplicator() {
    console.log('specifications.component addApplicator')
    if (!this.newApplicatorValid) {
      throw new RangeError('The new applicator being added is not valid')
    }
    this.machineSpecificationService.currentSpecification.applicator.push(this.newApplicator.toLowerCase())

    this.newApplicator = null
    this.newApplicatorValid = false

    this.dataPersistenceService.saveSpecificationsData(this.machineSpecificationService.currentSpecification)
  }

  checkNewSSDInput() {
    console.log('specifications.component checkNewSSDInput')
    if (
      this.machineSpecificationService.currentSpecification.ssd.indexOf(Number(this.newSSD)) < 0 && 
      this.newSSD != null && !isNaN(Number(this.newSSD))
    ) {
      this.newSSDValid = true;
    }
    else {
      this.newSSDValid = false;
    }
  }

  addSSD() {
    console.log('specifications.component addSSD')
    if (!this.newSSDValid) {
      throw new RangeError('The new ssd being added is not valid')
    }
    if (this.newSSDValid) {
    this.machineSpecificationService.currentSpecification.ssd.push(Number(this.newSSD))

    this.newSSD = null
    this.newSSDValid = false

    this.dataPersistenceService.saveSpecificationsData(this.machineSpecificationService.currentSpecification)
    }
  }

  editMachine(machine: string) {
    console.log('specifications.component editMachine')
    // this.currentSettings.machine = null
    // this.machineSpecificationService.currentSpecification = null
    this.edittingMachine = machine
  }

  finishMachineEdit(newMachineID: any, newMakeAndModel: any) {
    console.log('specifications.component finishMachineEdit')
    if (newMachineID != this.currentSettings.machine) {
      this.machineSpecificationService.currentSpecification.machine = newMachineID
      this.machineSpecificationService.updateMachineList()
    }
    this.machineSpecificationService.currentSpecification.makeAndModel = newMakeAndModel

    this.dataPersistenceService.saveSpecificationsData(this.machineSpecificationService.currentSpecification)
    this.edittingMachine = null;
  }

  // deleteMachine(machine:string) {
  //   console.log('specifications.component deleteMachine')
  //   let index = this.machines.indexOf(machine);
  //   this.machines.splice(index, 1);
  //   delete this.specifications[machine];

  //   this.edittingMachine = null;

  //   this.updateSpecifications();
  // }

}
