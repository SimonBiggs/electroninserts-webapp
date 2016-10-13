import { Component, Input, Output, OnChanges, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { MyJsonPipe } from './my-json.pipe'
import { JsonPipe } from '@angular/common';

import { Coordinates } from './coordinates';


@Component({
  selector: 'my-json-specifications',
  templateUrl: 'json-specifications.component.html',
})
export class JsonSpecificationsComponent implements OnInit {
  @Input()
  specifications: {};
  @Output()
  specificationsUpdated = new EventEmitter();

  editedSecifications: {};

  lines: number = 10;

  jsonValid: boolean = true;
  jsonErrorMessage: string;

  @ViewChild('jsonInput') jsonInputDir: any;

  onInput(jsonInput: string) {
    this.parseAndCheckJSON(jsonInput)
  }

  ngOnInit() {
    let value = new JsonPipe().transform(this.specifications); 
    this.lines = value.split(/\r\n|\r|\n/).length;
    this.editedSecifications = this.specifications;
  }

  updateSpecifications() {
    this.specifications = this.editedSecifications 
    this.specificationsUpdated.emit(this.specifications);
  }

  parseAndCheckJSON(jsonInput:string) {
    let oldJsonValid = this.jsonValid;
    this.jsonValid = false;
    try {
      this.editedSecifications = JSON.parse(jsonInput);
      this.jsonValid = true;
    }
    catch(err) {
      this.jsonErrorMessage = 'Error in JSON input. ' + err ;
    }
  }

}
