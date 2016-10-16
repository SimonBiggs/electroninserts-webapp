import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

import { TitleService } from './title.service'
import { ElectronApiService } from './electron-api.service';

@Component({
  selector: 'my-model',
  templateUrl: './model.component.html'
})
export class ModelComponent implements OnInit {
  modelData = {
      measurement: {
        width: [    
          3.15, 3.16, 3.17, 3.17, 3.17, 3.55, 3.66, 3.71, 4.2, 4.21, 
          4.21, 4.21, 4.21, 4.38, 4.48, 4.59, 4.59, 4.67, 5.21, 5.25,
          5.26, 5.26, 5.26, 5.34, 5.43, 5.72, 5.86, 6, 6.04, 6.08, 6.3,
          6.31, 6.41, 6.53, 6.54, 6.64, 6.78, 6.9, 7.08, 7.18, 7.21, 7.36, 
          7.56, 7.6, 7.64, 7.82, 8.06, 8.4, 9.45],
        length: [
          3.16, 5.25, 13.64, 6.83, 9.43, 7.7, 5.04, 4.36, 4.21, 10.51, 
          13.65, 6.82, 8.41, 5.47, 7.29, 5.67, 6.54, 6.28, 11.4, 5.26, 
          10.52, 13.66, 8.41, 9.64, 11.02, 11.6, 8.62, 7.98, 9.22, 6.64, 
          6.33, 8.24, 8.69, 10.99, 8.41, 9.81, 10.98, 10.25, 10.77, 11.27, 
          9.03, 7.37, 10.05, 10.26, 8.99, 10.85, 11.85, 8.42, 9.47],
        factor: [
          0.9294, 0.9346, 0.9533, 0.9488, 0.9488, 0.9443, 0.9434, 0.9488, 
          0.956, 0.9709, 0.9756, 0.9606, 0.9709, 0.9634, 0.9606, 0.9588, 0.9681, 
          0.9737, 0.9881, 0.9709, 0.9881, 0.9872, 0.9833, 0.993, 0.9872, 0.999, 
          0.9891, 0.9911, 0.999, 0.993, 0.9862, 0.9921, 0.999, 1, 0.993, 0.999, 
          1.007, 0.999, 1.005, 0.999, 1.0101, 1.003, 1.004, 1.0142, 1.003, 1.002, 
          1.007, 1.007, 1.0081],
      },
      model: {
        width: <number[]> [],
        length: <number[]> [],
        factor: <number[]> []
      }
  };

  initialMeasurementWidth: string = "";
  initialMeasurementLength: string = "";
  initialMeasurementFactor: string = "";


  modelURL: string;
  plot_width = 600;

  @ViewChild('plotContainer') plotContainer: any;

  constructor(
    private myTitleService: TitleService,
    private electronApiService: ElectronApiService,
    ngZone: NgZone
  ) {
    window.onresize = (e) =>
    {
        ngZone.run(() => {
            this.plot_width = this.plotContainer.nativeElement.clientWidth;
        });
    };
  }
 
  ngOnInit() {
    this.myTitleService.setTitle('Model');

    this.modelURL = localStorage.getItem("modelURL")
    if (this.modelURL == null) {
      this.modelURL = 'http://electronapi.simonbiggs.net/model';
    }
    this.plot_width = this.plotContainer.nativeElement.clientWidth;
    this.initialMeasurementWidth = String(this.modelData.measurement.width)
      .replace(/,/g,', ')
    this.initialMeasurementLength = String(this.modelData.measurement.length)
      .replace(/,/g,', ')
    this.initialMeasurementFactor = String(this.modelData.measurement.factor)
      .replace(/,/g,', ')
  }

  updateMeasurementWidth(widthInput: string) {
    try {
      this.modelData.measurement.width = eval('[' + widthInput + ']')
    }
    catch(err) {
      console.log(err)
    }  
  }

  updateMeasurementLength(lengthInput: string) {
    try {
      this.modelData.measurement.length = eval('[' + lengthInput + ']')
    }
    catch(err) {
      console.log(err)
    }  
  }

  updateMeasurementFactor(factorInput: string) {
    try {
      this.modelData.measurement.factor = eval('[' + factorInput + ']')
    }
    catch(err) {
      console.log(err)
    }  
  }

  basicServerSubmit() {
    this.electronApiService.sendToServer(
      this.modelURL,
      JSON.stringify(this.modelData.measurement)
    )
      .then((modelResult: any) => {
        this.modelData.model.width = modelResult.model_width;
        this.modelData.model.length = modelResult.model_length;
        this.modelData.model.factor = modelResult.model_factor;
      })
  }

  jsonInputUpdated(jsonInput: any) {
    this.modelData = jsonInput;
  }

  modelServerChange(newModelURL: string) {
    localStorage.setItem("modelURL", newModelURL);
  }

  defaultServer() {
    this.modelURL = 'http://electronapi.simonbiggs.net/model';
    localStorage.setItem("modelURL", this.modelURL);
  }

}
