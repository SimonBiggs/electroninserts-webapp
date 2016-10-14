import { Component, Input, Output, OnChanges, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { MyJsonPipe } from './my-json.pipe'
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'my-json-edit',
  templateUrl: 'json-edit.component.html',
})
export class JsonEditComponent implements OnInit {
  @Input()
  input: {};
  @Input()
  buttonText: string = "Button";
  @Output()
  inputUpdated = new EventEmitter();
  @Input()
  validationCheck: Function = (parsedJSON: {}) => {};
  @Input()
  useMyJsonPipe: boolean = false;

  editedInput: {};

  lines: number = 10;

  jsonValid: boolean = true;
  jsonErrorMessage: string;

  @ViewChild('jsonInput') jsonInputDir: any;

  onInput(jsonInput: string) {
    this.parseAndCheckJSON(jsonInput)
  }

  ngOnInit() {
    let value = "";
    if (this.useMyJsonPipe) {
       value = new MyJsonPipe().transform(this.input); 
    }
    else {
      value = new JsonPipe().transform(this.input);
    }     
    this.lines = value.split(/\r\n|\r|\n/).length;    
    this.editedInput = this.input;
  }

  updateInput() {
    this.input = this.editedInput 
    this.inputUpdated.emit(this.input);
  }

  parseAndCheckJSON(jsonInput:string) {
    let oldJsonValid = this.jsonValid;
    this.jsonValid = false;
    try {
      let parsedJSON = JSON.parse(jsonInput);
      this.validationCheck(parsedJSON);
      this.editedInput = parsedJSON;
      this.jsonValid = true;
    }
    catch(err) {
      this.jsonErrorMessage = 'Error in JSON input. ' + err ;
    }
  }

}
