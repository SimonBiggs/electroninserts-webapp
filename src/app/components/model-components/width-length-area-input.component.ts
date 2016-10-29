import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { ModelData, AreaLengthConversion } from '../../services/data-services/model-data'

import { validateInput } from '../../services/utility-services/sanitise-validation'


@Component({
  selector: 'my-width-length-area-input',
  templateUrl: './width-length-area-input.component.html'
})
export class WidthLengthAreaInputComponent implements OnInit, DoCheck {
  @Input()
  textboxLabels = {
    width: "Width of ellipse given by diameter of largest encompassed circle (cm @iso)",
    length: "Length of ellipse that matches insert shape area (cm @iso)",
    area: "Area of insert shape (cm^2 @iso)",
    measuredFactor: "Measured insert factor (as per TG 25)"
  }
  @Input()
  dataInputs: AreaLengthConversion
  @Input()
  triggerUpdate: boolean
  @Input()
  disabled: boolean = false
  @Input()
  rows = 2
  @Output()
  validTextBoxChange = new EventEmitter()
  @Output()
  texboxValidCheck = new EventEmitter()

  textboxInput = {
    width: <string> null,
    length: <string> null,
    area: <string> null,
    measuredFactor: <string> null
  }

  textboxValid = {
    width: true,
    length: true,
    area: true,
    measuredFactor: true
  }

  lastEdit: string = 'length'

  
  ngOnInit() {
    this.updateAllTextboxInputs()
  }

  ngDoCheck() {
    if (this.triggerUpdate) {
      this.updateAllTextboxInputs()
      // console.log(this.triggerUpdate)
      this.triggerUpdate = false
    }
  }

  updateAllTextboxInputs() {
    for (let key of ['width', 'length', 'area', 'measuredFactor']) {
      this.updateTextboxInput(key)
    }
  }

  updateTextboxInput(key: string) {
    this.textboxInput[key] = String(this.dataInputs[key])
      .replace(/,/g, ', ')
  }

  checkAllValid() {
    for (let key of ['width', 'length', 'area', 'measuredFactor']) {
      if (!this.textboxValid[key]) {
        return false
      }
    }
    return true
  }

  onTextboxChange(key: string, newInput: string) {
    let oldValid = this.textboxValid[key]
    this.textboxValid[key] = false

    try {
      if (validateInput(newInput)) {
        this.dataInputs[key] = eval('[' + newInput.replace(/[,;\n\t]\s*/g, ', ') + ']')
        this.textboxValid[key] = true
      }
    }
    catch (err) {
      console.log(err)
    }

    if (this.textboxValid[key] != oldValid) {
      this.texboxValidCheck.emit(this.checkAllValid())
    }
    

    if (this.textboxValid[key]) {
      if (key == 'length' || (key == 'width' && this.lastEdit == 'length')) {
        this.dataInputs.updateAreaFromLength()
        this.updateTextboxInput('area')
        this.lastEdit = 'length'
      }
      if (key == 'area' || (key == 'width' && this.lastEdit == 'area')) {
        this.dataInputs.updateLengthFromArea()
        this.updateTextboxInput('length')
        this.lastEdit = 'area'
      }
      this.validTextBoxChange.emit()
    }
  }
}