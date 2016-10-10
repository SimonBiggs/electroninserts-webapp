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

  constructor(
    private myTitleService: TitleService
  ) {}

  changeCurrentMachine(machine: string) {
    this.currentMachine = machine;
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
    this.machines.push(this.newMachineID);
    this.specifications[this.newMachineID] = {};
    this.specifications[this.newMachineID]["model"] = this.newModel;

    this.newMachineID = "";
    this.checkNewMachineIDInput();
    this.newModel = "";
    this.checkNewModelInput();
  }
  
  ngOnInit() {
    this.myTitleService.setTitle('Specifications');
    this.machines = ["2619", "2694", "Another"];

    this.specifications = {
      "2619": {
        "model": "Elekta Synergy",
        "energy": [6, 9, 12],
        "R50": {
          6: 0,
          9: 0,
          12: 0
        },
        "applicator": ["10X10", "6X6"],
        "ssd": [100]
      },
      "2694": {
        "model": "Elekta Synergy",
        "energy": [6, 9, 12],
        "R50": {
          6: 0,
          9: 0,
          12: 0
        },
        "applicator": ["14X14", "6X6"],
        "ssd": [100]
      },
      "Another": {
        "model": "Varian True Beam",
        "energy": [6, 8, 10],
        "R50": {
          6: 0,
          8: 0,
          10: 0
        },
        "applicator": ["10X10", "6X6"],
        "ssd": [100]
      }
    }
  }

}
