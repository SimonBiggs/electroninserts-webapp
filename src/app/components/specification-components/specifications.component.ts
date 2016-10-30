import { Component, OnInit } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'

import { CurrentSettings } from '../../services/data-services/current-settings'
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'


@Component({
  selector: 'my-specifications',
  templateUrl: './specifications.component.html'
})
export class SpecificationsComponent implements OnInit {
  machines: string[];
  specifications = {};

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

  constructor(
    private myTitleService: TitleService,
    private currentSettings: CurrentSettings,
    private dataPersistenceService: DataPersistenceService
  ) {}


  ngOnInit() {
    console.log('specifications.component ngOnInit')
    this.myTitleService.setTitle('Specifications');
    this.dataPersistenceService.loadCurrentSettings().then((currentSettings: CurrentSettings) => {
      this.currentSettings = currentSettings
    })
    this.loadSpecifications()
  }

  loadSpecifications() {
    console.log('specifications.component loadSpecifications')
    this.specifications = JSON.parse(localStorage.getItem("specifications"))
    this.checkUpdatedSpecifications()
  }

  checkUpdatedSpecifications() {
    console.log('specifications.component checkUpdatedSpecifications')
    if (this.specifications == null) {
      this.specifications = {}
      this.machines = []
    }
    else {
      this.machines = Object.keys(this.specifications).sort();
    }
  }

  changeSpecifications(newSpecifications: {}) {
    console.log('specifications.component changeSpecifications')
    this.specifications = newSpecifications;
    this.checkUpdatedSpecifications()
    
    // this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
    this.updateSpecifications()
  } 

  updateSpecifications() {
    console.log('specifications.component updateSpecifications')
    // localStorage.setItem("specifications", JSON.stringify(this.specifications));
  }

  changeCurrentMachine(machine: string) {
    console.log('specifications.component changeCurrentMachine')
    this.currentSettings.machine = machine;
    this.dataPersistenceService.saveCurrentSettings(this.currentSettings)
  }

  checkNewMachineIDInput() {
    console.log('specifications.component checkNewMachineIDInput')
    if (this.specifications[this.newMachineID] == null && this.newMachineID != null && this.newMachineID != "") {
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
    if (this.newMachineValid) {
      this.machines.push(this.newMachineID);
      this.specifications[this.newMachineID] = {};
      this.specifications[this.newMachineID]["model"] = this.newModel;
      this.specifications[this.newMachineID]["energy"] = [];
      this.specifications[this.newMachineID]["R50"] = {};
      this.specifications[this.newMachineID]["applicator"] = [];
      this.specifications[this.newMachineID]["ssd"] = [];

      this.changeCurrentMachine(this.newMachineID);

      this.newMachineID = null;
      this.newModel = null;
      this.newMachineIDValid = false;
      this.newModelValid = false;
      this.newMachineValid = false;      

      this.updateSpecifications();
    }
  }

  checkNewEnergyInput() {
    console.log('specifications.component checkNewEnergyInput')
    if (this.specifications[this.currentSettings.machine]["energy"].indexOf(Number(this.newEnergy)) < 0 && this.newEnergy != null && !isNaN(Number(this.newEnergy))) {
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
    if (this.newEnergySetValid) {
      this.specifications[this.currentSettings.machine]["energy"].push(Number(this.newEnergy));
      this.specifications[this.currentSettings.machine]["R50"][this.newEnergy] = Number(this.newR50);

      this.newEnergy = null;
      this.newR50 = null;
      this.newEnergyValid = false;
      this.newR50Valid = false;
      this.newEnergySetValid = false;

      this.updateSpecifications();
    }

  }

  checkNewApplicatorInput() {
    console.log('specifications.component checkNewApplicatorInput')
    if (this.specifications[this.currentSettings.machine]["applicator"].indexOf(this.newApplicator.toLowerCase()) < 0 && this.newApplicator != null && this.newApplicator != "") {
      this.newApplicatorValid = true;
    }
    else {
      this.newApplicatorValid = false;
    }
  }

  addApplicator() {
    console.log('specifications.component addApplicator')
    if (this.newApplicatorValid) { 
      this.specifications[this.currentSettings.machine]["applicator"].push(this.newApplicator.toLowerCase());

      this.newApplicator = null;
      this.newApplicatorValid = false;

      this.updateSpecifications();
    }
  }

  checkNewSSDInput() {
    console.log('specifications.component checkNewSSDInput')
    if (this.specifications[this.currentSettings.machine]["ssd"].indexOf(Number(this.newSSD)) < 0 && this.newSSD != null && !isNaN(Number(this.newSSD))) {
      this.newSSDValid = true;
    }
    else {
      this.newSSDValid = false;
    }
  }

  addSSD() {
    console.log('specifications.component addSSD')
    if (this.newSSDValid) {
    this.specifications[this.currentSettings.machine]["ssd"].push(Number(this.newSSD));

    this.newSSD = null;
    this.newSSDValid = false;

    this.updateSpecifications();
    }
  }

  editMachine(machine:string) {
    console.log('specifications.component editMachine')
    this.currentSettings.machine = null;
    this.edittingMachine = machine;
  }

  finishMachineEdit(machine: any, idInput: any, modelInput: any) {
    console.log('specifications.component finishMachineEdit')
    if (idInput != machine) {
      this.specifications[idInput] = this.specifications[machine]
      delete this.specifications[machine]
      this.machines = Object.keys(this.specifications).sort();
    }
    this.specifications[idInput]["model"] = modelInput;

    this.updateSpecifications();

    this.currentSettings.machine = this.edittingMachine;
    this.edittingMachine = null;
  }

  deleteMachine(machine:string) {
    console.log('specifications.component deleteMachine')
    let index = this.machines.indexOf(machine);
    this.machines.splice(index, 1);
    delete this.specifications[machine];

    this.edittingMachine = null;

    this.updateSpecifications();
  }

}
