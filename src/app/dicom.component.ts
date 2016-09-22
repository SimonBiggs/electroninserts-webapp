import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';

import { Coordinates } from './coordinates'
import { Parameterisation } from './parameterisation';

import { TitleService } from './title.service';

declare var Module: any;
declare var FS: any;
// declare var pypyjs: any;

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
  dicomExitCode = 1;

  dicomX: number[];
  dicomY: number[];
  dicomInsert: Coordinates;

  header: string = '';

  reader = new FileReader();
  firstLoad = true;

  constructor(
    private myTitleService: TitleService
  ) { }

  @ViewChild('dicomOutput') dicomOutputDir: any;
  @ViewChild('getBlockDataButton') getBlockDataButton: any;


  ngOnInit() {
    this.reader.onload = () => this.onceFileIsLoaded();

    localStorage.removeItem('dicomPrint');
    Module.print = this.sendDicomDumpToLocalStorage;
    // Module.printErr = this.sendDicomDumpToLocalStorage;
    this.myTitleService.setTitle('Dicom');

    // pypyjs.exec("import json; print json.dumps({'hello': 'world'})")
    // pypyjs.exec("import dicom; print json.dumps({'hello': 'world'})")
  }

  sendDicomDumpToLocalStorage(print: any) {
    let priorDicomPrint = localStorage.getItem('dicomPrint');
    localStorage.setItem('dicomPrint', priorDicomPrint + print);
  }

  updateDicomWarning() {
    let status = Number(localStorage.getItem('dicomLoadStatus'));
    if (status == 0) {
      this.getBlockDataButton.disabled = false;
      this.dicomWarning = null;
    }
    else {
      this.getBlockDataButton.disabled = true;
      this.dicomWarning = 'An error occured while trying to find the block data within the provided Dicom file.';
    }
  }

  onceFileIsLoaded() {
    let content = new Int8Array(this.reader.result);
    console.log(content.length);
    // let fileName = Math.random().toString(36).substr(2, 5);
    // console.log(fileName);
    let fileName = 'dicomfile';

    if (FS.isFile(fileName)) {
      FS.unlink(fileName);
    }
    FS.writeFile(fileName, content, {encoding: "binary"});

    let exit_orig = Module.exit;    
    Module.exit = (status: any) => {
      localStorage.setItem('dicomLoadStatus', status);
      exit_orig(status);
    }
    // if (Module.calledRun) {
    //   Module.callMain(['dcmdump', fileName, '--print-all']);
    // }
    // else {
      Module.callMain(
        ['dcmdump', fileName, '--print-all', '--search', '300a,0106'] // http://support.dcmtk.org/docs/dcmdump.html
      );
    // }

    Module.exit = exit_orig;

    console.log(Module)

    this.updateDicomWarning()
    FS.unlink(fileName);
  }

  openFile(event: any) {
    console.log(event.srcElement.files);
    let file = event.srcElement.files[0];

    localStorage.removeItem('dicomPrint');
    localStorage.setItem('dicomPrint', ' ');

    this.reader.readAsArrayBuffer(file);
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
