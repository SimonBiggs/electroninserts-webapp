import { Component, Input, Output, OnChanges, EventEmitter, ViewChild } from '@angular/core';

import { MyJsonPipe } from './my-json.pipe'

import { Coordinates } from './coordinates';


@Component({
  selector: 'my-json-input',
  templateUrl: 'json-input.component.html',
})
export class JsonInputComponent implements OnChanges {
  @Input()
  insert: Coordinates;
  @Input()
  jsonDisabled: boolean;
  @Input()
  refresh: boolean;
  @Output()
  insertUpdated = new EventEmitter();
  @Output()
  jsonStatus = new EventEmitter();

  jsonValid: boolean = true;
  jsonErrorMessage: string;

  @ViewChild('jsonInput') jsonInputDir: any;

  onInput(jsonInput: string) {
    this.parseAndCheckJSON(jsonInput) 
    this.insertUpdated.emit(this.insert);
  }

  ngOnChanges() {
    if (this.refresh) {
      this.jsonInputDir.value = new MyJsonPipe().transform(this.insert);      
      this.parseAndCheckJSON(this.jsonInputDir.value);
      this.refresh = false;
    }
  }

  parseAndCheckJSON(jsonInput:string) {
    let oldJsonValid = this.jsonValid;
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
      if (this.jsonValid != oldJsonValid) {
        this.jsonStatus.emit(this.jsonValid)
      }
    }
  }

}
