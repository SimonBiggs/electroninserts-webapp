import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

import { Coordinates } from './coordinates';

@Component({
  selector: 'my-json-input',
  templateUrl: 'json-input.component.html',
})
export class JsonInputComponent {
  @Input()
  insert: Coordinates;
  @Output()
  insertUpdated = new EventEmitter();

  jsonValid: boolean = true;
  jsonErrorMessage: string;

  onInput(jsonInput: string) {
    this.parseAndCheckJSON(jsonInput) 
    this.insertUpdated.emit(this.insert);
  }

  parseAndCheckJSON(jsonInput:string) {
    this.jsonValid = false;
    try {
      let parsedJSON = JSON.parse(jsonInput);
      if ('x' in parsedJSON && 'y' in parsedJSON) {
        if (parsedJSON.x.length === parsedJSON.y.length) {
          let x: [number] = parsedJSON.x
          let y: [number] = parsedJSON.y
          let insert = {
            x: x,
            y: y
          }
          this.insert = insert
          this.jsonValid = true;
        }
        else {
          this.jsonErrorMessage = 'The length of x doesn\'t match the length of y.';
        }
      }
      else {
        this.jsonErrorMessage = 'Either x or y is missing.';
      }
    }
    catch(err) {
      this.jsonErrorMessage = 'Error in JSON input. ' + err ;
    }
    finally {

    }
  }

}
