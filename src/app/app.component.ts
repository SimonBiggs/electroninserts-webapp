import { Component, OnInit } from '@angular/core';

import { ElectronApiService } from './electron-api.service';


@Component({
  selector: 'my-app',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  parameteriseInput: string = `{
  "x": [
    0.99, -0.14, -1.0, -1.73, -2.56, -3.17, -3.49, -3.57, 
    -3.17, -2.52, -1.76, -1.04, -0.17, 0.77, 1.63, 2.36, 
    2.79, 2.91, 3.04, 3.22, 3.34, 3.37, 3.08, 2.54, 1.88,
    1.02, 0.99],
  "y": [
    5.05, 4.98, 4.42, 3.24, 1.68, 0.6, -0.64, -1.48, 
    -2.38, -3.77, -4.81,  -5.26, -5.51, -5.58, -5.23, 
    -4.64, -3.77, -2.77, -1.68, -0.29, 1.23, 2.68, 3.8, 
    4.6, 5.01, 5.08, 5.05]
}`;
  parsedJSON: any;
  jsonValid: boolean = true;
  jsonErrorMessage: string;
  parameterisationResult: any;

  constructor(
    private electronApiService: ElectronApiService
  ) { }

  onSubmit() {
    this.electronApiService.parameteriseInsert(this.parameteriseInput)
      .then(parameterisationResult => this.parameterisationResult = parameterisationResult);
  }

  checkJSON() {
    this.jsonValid = false;
    try {
      let json_test = JSON.parse(this.parameteriseInput);
      if ('x' in json_test && 'y' in json_test) {
        this.parsedJSON = json_test;
        if (this.parsedJSON.x.length === this.parsedJSON.y.length) {
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

  ngOnInit() {
    this.electronApiService.wakeUpServer();
  }

}
