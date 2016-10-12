import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'

@Component({
  selector: 'my-specifications',
  templateUrl: './specifications.component.html'
})
export class SpecificationsComponent implements OnInit {
  machines: string[];
  specifications = {};
  currentMachine: string;

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
    private myTitleService: TitleService
  ) {}

  changeCurrentMachine(machine: string) {
    this.currentMachine = machine;
    this.updateCurrentMachine()
  }

  checkNewMachineIDInput() {
    if (this.specifications[this.newMachineID] == null && this.newMachineID != null && this.newMachineID != "") {
      this.newMachineIDValid = true;
    }
    else {
      this.newMachineIDValid = false;
    }

    this.checkNewMachineValid()
  }

  checkNewModelInput() {
    if (this.newModel != null && this.newModel != "") {
      this.newModelValid = true;
    }
    else {
      this.newModelValid = false;
    }

    this.checkNewMachineValid()
  }

  checkNewMachineValid() {
    this.newMachineValid = (this.newMachineIDValid && this.newModelValid);
  }

  addMachineID() {
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
    if (this.specifications[this.currentMachine]["energy"].indexOf(Number(this.newEnergy)) < 0 && this.newEnergy != null && !isNaN(Number(this.newEnergy))) {
      this.newEnergyValid = true;
    }
    else {
      this.newEnergyValid = false;
    }

    this.checkNewEnergySetValid()
  }

  checkNewR50Input() {
    if (this.newR50 != null && !isNaN(Number(this.newR50))) {
      this.newR50Valid = true;
    }
    else {
      this.newR50Valid = false;
    }

    this.checkNewEnergySetValid()
  }

  checkNewEnergySetValid() {
    this.newEnergySetValid = (this.newEnergyValid && this.newR50Valid);
  }

  addEnergy() {
    if (this.newEnergySetValid) {
      this.specifications[this.currentMachine]["energy"].push(Number(this.newEnergy));
      this.specifications[this.currentMachine]["R50"][this.newEnergy] = Number(this.newR50);

      this.newEnergy = null;
      this.newR50 = null;
      this.newEnergyValid = false;
      this.newR50Valid = false;
      this.newEnergySetValid = false;

      this.updateSpecifications();
    }

  }

  checkNewApplicatorInput() {
    if (this.specifications[this.currentMachine]["applicator"].indexOf(this.newApplicator.toLowerCase()) < 0 && this.newApplicator != null && this.newApplicator != "") {
      this.newApplicatorValid = true;
    }
    else {
      this.newApplicatorValid = false;
    }
  }

  addApplicator() {
    if (this.newApplicatorValid) { 
      this.specifications[this.currentMachine]["applicator"].push(this.newApplicator.toLowerCase());

      this.newApplicator = null;
      this.newApplicatorValid = false;

      this.updateSpecifications();
    }
  }

  checkNewSSDInput() {
    if (this.specifications[this.currentMachine]["ssd"].indexOf(this.newSSD) < 0 && this.newSSD != null && !isNaN(Number(this.newSSD))) {
      this.newSSDValid = true;
    }
    else {
      this.newSSDValid = false;
    }
  }

  addSSD() {
    if (this.newSSDValid) {
    this.specifications[this.currentMachine]["ssd"].push(Number(this.newSSD));

    this.newSSD = null;
    this.newSSDValid = false;

    this.updateSpecifications();
    }
  }

  updateSpecifications() {
    localStorage.setItem("specifications", JSON.stringify(this.specifications));
  }

  updateCurrentMachine() {
    localStorage.setItem("current_machine", JSON.stringify(this.currentMachine));
  }

  editMachine(machine:string) {
    this.currentMachine = null;
    this.edittingMachine = machine;
  }

  finishMachineEdit(machine: any, idInput: any, modelInput: any) {
    if (idInput != machine) {
      this.specifications[idInput] = this.specifications[machine]
      delete this.specifications[machine]
      this.machines = Object.keys(this.specifications).sort();
    }
    this.specifications[idInput]["model"] = modelInput;

    this.updateSpecifications();

    this.currentMachine = this.edittingMachine;
    this.edittingMachine = null;
  }

  deleteMachine(machine:string) {
    let index = this.machines.indexOf(machine);
    this.machines.splice(index, 1);
    delete this.specifications[machine];

    this.edittingMachine = null;

    this.updateSpecifications();
  }
  
  ngOnInit() {
    this.myTitleService.setTitle('Specifications');
    

    this.specifications = JSON.parse(localStorage.getItem("specifications"));
    if (this.specifications == null) {
      this.specifications = {};
      this.machines = [];
    }
    else {
      this.machines = Object.keys(this.specifications).sort();

      this.currentMachine = JSON.parse(localStorage.getItem("current_machine"));
      if (this.currentMachine == null) {
        this.currentMachine = this.machines[0];
      }
    }
    

    // this.specifications = {
    //   "2619": {
    //     "model": "Elekta Synergy",
    //     "energy": [6, 9, 12],
    //     "R50": {
    //       6: 0,
    //       9: 0,
    //       12: 0
    //     },
    //     "applicator": ["10X10", "6X6"],
    //     "ssd": [100]
    //   },
    //   "2694": {
    //     "model": "Elekta Synergy",
    //     "energy": [6, 9, 12],
    //     "R50": {
    //       6: 0,
    //       9: 0,
    //       12: 0
    //     },
    //     "applicator": ["14X14", "6X6"],
    //     "ssd": [100]
    //   },
    //   "Another": {
    //     "model": "Varian True Beam",
    //     "energy": [6, 8, 10],
    //     "R50": {
    //       6: 0,
    //       8: 0,
    //       10: 0
    //     },
    //     "applicator": ["10X10", "6X6"],
    //     "ssd": [100]
    //   }
    // }
    
  }

}
