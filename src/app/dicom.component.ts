import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';

import { Coordinates } from './coordinates'
import { Parameterisation } from './parameterisation';

import { TitleService } from './title.service';

declare var Module: any;
declare var FS: any;

@Component({
  selector: 'my-dicom',
  templateUrl: './dicom.component.html',
  styles: ['./dicom.component.css']
})
export class DicomComponent implements OnInit {
  parameterisation: Parameterisation = {
    insert: {
      x: [0],
      y: [0]
    },
    width: null,
    length: null,
    circle: null,
    ellipse: null
  };

  rawBlockData: string = '';
  vectorData: string = '';
  parseDataString: string = '';

  dicomWarning: string;

  dicomX: number[];
  dicomY: number[];
  dicomInsert: Coordinates;

  header: string = '';

  constructor(
    private myTitleService: TitleService
  ) { }

  @ViewChild('dicomOutput') dicomOutputDir: any;
  @ViewChild('getBlockDataButton') getBlockDataButton: any;

  execute(prog: any, args:any) {
    let exit_orig = Module.exit;
    let exitCode: any;
    Module.exit = function(status: any) {
      exitCode = status;
      exit_orig(status);
    }
    Module.callMain([prog].concat(args));
    Module.exit = exit_orig;
    return exitCode;
  }
  
  dcmdump(reader: any, file: any) {
    let fileName = '/uploadedfile.dcm';
    // console.log("Writing...");
    let content = new Int8Array(reader.result);
    FS.writeFile(fileName, content, {encoding: "binary"});
    // console.log("Dumping...");

    let prog = 'dcmdump';
    let args = [
      fileName, '--print-all', '--search', '300a,0106']; // http://support.dcmtk.org/docs/dcmdump.html

    let exit_orig = Module.exit;
    let exitCode: any;
    Module.exit = function(status: any) {
      exitCode = status;
      exit_orig(status);
    }
    Module.callMain([prog].concat(args));
    Module.exit = exit_orig;
    return exitCode;
  }

  readFile(file: any, processor: any) {
    let reader = new FileReader();

    reader.onload = (function(file) {
      return function(e: any) { processor(reader, file) };
    })(file);

    reader.readAsArrayBuffer(file);
  }

  openFile(event: any) {
    // console.log('start opening');
    let file = event.srcElement.files[0];
    console.log(file.type);

    if (file.type === 'application/dicom') {
      this.getBlockDataButton.disabled = false;
      this.dicomWarning = null;

      localStorage.removeItem('dicomPrint');
      localStorage.setItem('dicomPrint', '')

      this.readFile(file, this.dcmdump);
    }
    else {
      this.getBlockDataButton.disabled = true;
      this.dicomWarning = "The file you are loading must have a '.dcm' extension. Please confirm that the file you loaded has the relevant extension."
    }



  }

  getBlockData() {
    let dicomPrint = localStorage.getItem('dicomPrint');
    this.rawBlockData = dicomPrint;
    this.parseDataString = /\[[\\\d\.-]*\]/.exec(dicomPrint).toString();
    this.parseDataString = this.parseDataString.replace(/\\/g, ', ')
    console.log(this.parseDataString)
    let parsedData = JSON.parse('{ "data": ' + this.parseDataString + '}');
    let x: number[] = [];
    let y: number[] = [];
    let i = 0;
    for (let num of parsedData['data']) {
      if (i % 2 == 0) {
        x.push(parseFloat((num / 10).toFixed(2)));
      }
      else {
        y.push(parseFloat((num / 10).toFixed(2)));
      }
      i++;
    }
    this.dicomX = x;
    this.dicomY = y;
    this.dicomInsert = {
      "x": this.dicomX,
      "y": this.dicomY
    }
  }

  sendToParameterisation() {
    this.insertUpdated(this.dicomInsert);
    localStorage.setItem(
      "last_parameterisation", JSON.stringify(this.parameterisation)
    );
  }

  sendDicomDumpToLocalStorage(print: any) {
    let priorDicomPrint = localStorage.getItem('dicomPrint');
    localStorage.setItem('dicomPrint', priorDicomPrint + print);
  }
  
  ngOnInit() {
    localStorage.removeItem('dicomPrint');
    Module.print = this.sendDicomDumpToLocalStorage;
    this.myTitleService.setTitle('Dicom');
  }

  parameterisationFromLocalStorage(localStorageParameterisationString: string) {
    let localStorageParameterisation = JSON.parse(localStorageParameterisationString); 
    this.parameterisation.insert = localStorageParameterisation['insert'];
    this.parameterisation.width = localStorageParameterisation['width'];
    this.parameterisation.length = localStorageParameterisation['length'];
    this.parameterisation.circle = localStorageParameterisation['circle'];
    this.parameterisation.ellipse = localStorageParameterisation['ellipse'];
  }

  insertUpdated(insert: any) {
    let localStorageParameterisation = localStorage.getItem(JSON.stringify(insert))
    if (localStorageParameterisation) {
      this.parameterisationFromLocalStorage(localStorageParameterisation);
    }
    else {
      this.parameterisation.insert = insert;
      this.parameterisation.width = null;
      this.parameterisation.length = null;
      this.parameterisation.circle = null;
      this.parameterisation.ellipse = null;
    }
  }


}
