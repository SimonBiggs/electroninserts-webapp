import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { ModelData, AreaLengthConversion } from '../../services/data-services/model-data'
import { TextInputControl } from '../../services/utility-services/text-input-control'


@Component({
  selector: 'my-width-length-area-input',
  templateUrl: '../misc-components/shared-text-input-template.html'
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
  texboxValidCheck = new EventEmitter();

  lastEdit: string = 'length'
  textInputControl: TextInputControl
  
  ngOnInit() {
    this.textInputControl = new TextInputControl(
      ['width', 'length', 'area', 'measuredFactor'],
      this.dataInputs)
    this.textInputControl.updateAllTextboxInputs()

  }

  ngDoCheck() {
    if (this.triggerUpdate) {
      this.textInputControl.updateAllTextboxInputs()
      // console.log(this.triggerUpdate)
      this.triggerUpdate = false
    }
  }

  onTextboxChange(key: string, newInput: string) {
    let oldValid = this.textInputControl.textboxValid[key]
    this.textInputControl.validateTextboxInput(key, newInput)
    if (this.textInputControl.textboxValid[key] != oldValid) {
      this.texboxValidCheck.emit(this.textInputControl.checkAllValid())
    }

    if (this.textInputControl.textboxValid[key]) {
      if (key == 'length' || (key == 'width' && this.lastEdit == 'length')) {
        this.dataInputs.updateAreaFromLength()
        this.textInputControl.updateTextboxInput('area')
        this.lastEdit = 'length'
      }
      if (key == 'area' || (key == 'width' && this.lastEdit == 'area')) {
        this.dataInputs.updateLengthFromArea()
        this.textInputControl.updateTextboxInput('length')
        this.lastEdit = 'area'
      }
      this.validTextBoxChange.emit()
    }
  }
}