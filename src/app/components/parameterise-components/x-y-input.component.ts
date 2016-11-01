import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { Coordinates } from '../../services/data-services/insert-data'
import { TextInputControl } from '../../services/utility-services/text-input-control'


@Component({
  selector: 'my-x-y-input',
  templateUrl: '../misc-components/shared-text-input-template.html'
})
export class XYInputComponent implements OnInit, DoCheck {
  @Input()
  textboxLabels = {
    x: "X coordinates (cm @iso)",
    y: "Y coordinates (cm @iso)"
  }
  @Input()
  dataInputs: Coordinates
  @Input()
  triggerUpdate: boolean
  @Input()
  disabled: boolean = false
  @Input()
  rows = 4
  @Output()
  validTextBoxChange = new EventEmitter()
  @Output()
  texboxValidCheck = new EventEmitter();

  textInputControl: TextInputControl
  
  ngOnInit() {
    this.textInputControl = new TextInputControl(
      ['x', 'y'],
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
      this.validTextBoxChange.emit()
    }
  }
}