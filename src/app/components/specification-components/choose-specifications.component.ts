import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';


@Component({
  selector: 'my-choose-specifications',
  templateUrl: './choose-specifications.component.html'
})
export class ChooseSpecificationsComponent implements OnInit {
  machineList: string[]
  allMachineSpecifications: {}
  currentMachineSpecifications: {}
  @Input()
  currentSettings = {
    machine: <string> null,
    energy: <number> null,
    applicator: <string> null,
    ssd: <number> null
  }

  @Output()
  settingsUpdated = new EventEmitter()

 
  ngOnInit() {
    this.currentSettings.energy = JSON.parse(localStorage.getItem("currentEnergy"))
    this.currentSettings.applicator = JSON.parse(localStorage.getItem("currentApplicator"))
    this.currentSettings.ssd = JSON.parse(localStorage.getItem("currentSSD"))

    this.allMachineSpecifications = JSON.parse(localStorage.getItem("specifications"))
    if (this.allMachineSpecifications == null) {
      this.allMachineSpecifications = {}
      this.machineList = []
    }
    else {
      this.machineList = Object.keys(this.allMachineSpecifications).sort();
      this.currentSettings.machine = String(JSON.parse(localStorage.getItem("current_machine")))
      if (
          this.currentSettings.machine == null || 
          this.allMachineSpecifications[this.currentSettings.machine] === undefined) {
        this.currentSettings.machine = this.machineList[0]
      }
      this.currentMachineSpecifications = this.allMachineSpecifications[this.currentSettings.machine]
    }
    
    this.settingsUpdated.emit(this.currentSettings)
  }

  updateMachineID(newCurrentMachine: string) {
    this.currentSettings.machine = newCurrentMachine
    localStorage.setItem("current_machine", JSON.stringify(newCurrentMachine))
    this.currentMachineSpecifications = this.allMachineSpecifications[this.currentSettings.machine]

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

    localStorage.setItem("currentEnergy", JSON.stringify(Number(this.currentSettings.energy)))
    localStorage.setItem("currentApplicator", JSON.stringify(this.currentSettings.applicator))
    localStorage.setItem("currentSSD", JSON.stringify(Number(this.currentSettings.ssd)))

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateEnergy(newCurrentEnergy: number) {
    this.currentSettings.energy = Number(newCurrentEnergy)
    localStorage.setItem("currentEnergy", JSON.stringify(Number(newCurrentEnergy)))

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateApplicator(newCurrentApplicator: string) {
    this.currentSettings.applicator = newCurrentApplicator
    localStorage.setItem("currentApplicator", JSON.stringify(newCurrentApplicator))

    this.settingsUpdated.emit(this.currentSettings)
  }

  updateSSD(newCurrentSSD: number) {
    this.currentSettings.ssd = Number(newCurrentSSD)
    localStorage.setItem("currentSSD", JSON.stringify(Number(newCurrentSSD)))

    this.settingsUpdated.emit(this.currentSettings)
  }
}
