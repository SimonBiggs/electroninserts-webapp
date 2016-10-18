import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { Coordinates } from './coordinates'
import { Parameterisation } from './parameterisation';
import { InsertData } from './insert-data';

import { TitleService } from './title.service';

import { safeLoad } from 'js-yaml';

declare var Module: any;
declare var FS: any;

// declare var yaml: any;
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

  insertData: InsertData = {
    machine: null,
    parameterisation: this.parameterisation,
    energy: null,
    applicator: null,
    ssd: null,
    factor: null
  }

  dicomWarning: string;
  dicomExitCode = 1;

  insertList: any[];

  reader = new FileReader();

  constructor(
    private myTitleService: TitleService,
    private router: Router
  ) { }

  @ViewChild('dicomOutput') dicomOutputDir: any;
  @ViewChild('getBlockDataButton') getBlockDataButton: any;


  ngOnInit() {
    window['dicomData'] = ' ';

    this.reader.onload = () => this.onceFileIsLoaded();
    
    let insertListString = localStorage.getItem('dicom_insertList')
    if (insertListString) {
      this.insertList = JSON.parse(insertListString);
    }
    else {
      this.insertList = []
    }

    // localStorage.removeItem('dicomPrint');
    Module.print = this.sendDicomDumpToGlobalVariable;
    // Module.printErr = this.sendDicomDumpToLocalStorage;
    this.myTitleService.setTitle('Dicom');

    // pypyjs.exec("import json; print json.dumps({'hello': 'world'})")
    // pypyjs.exec("import dicom; print json.dumps({'hello': 'world'})")
  }

  sendDicomDumpToGlobalVariable(print: any) {
    window['dicomData'] = window['dicomData'] + '\n' + print
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
    Module.callMain(['dcmdump', fileName, '--print-all']);

    Module.exit = exit_orig;

    console.log(Module)

    this.updateDicomWarning()
    FS.unlink(fileName);
  }

  openFile(event: any) {

    if (typeof event.target !== 'undefined') {
      console.log(event.target.files);
      let file = event.target.files[0];

      window['dicomData'] = ' '

      this.reader.readAsArrayBuffer(file);
    }
    else {
      console.log(event);
    }

  }

  convertDicomDumpToDict(dump: string) {
    let yamlConvert = dump.replace(/\s*#[^#\n]*\n/g,'\n');
    yamlConvert = yamlConvert.replace(/\s*#[^#\n]*$/g,'');
    yamlConvert = yamlConvert.replace(/^\n*/,'');
    yamlConvert = yamlConvert.replace(/(\([0-9a-f][0-9a-f][0-9a-f][0-9a-f],[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\))/g,'$1:')
    yamlConvert = yamlConvert.replace(
      /(\([0-9a-f][0-9a-f][0-9a-f][0-9a-f],[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\):) SQ \(Sequence with undefined length #=\d+\)/g,
      '$1')
    yamlConvert = yamlConvert.replace(
      /(\([0-9a-f][0-9a-f][0-9a-f][0-9a-f],[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\):) na \(Item with undefined length #=\d+\)/g,
      '$1')
    yamlConvert = yamlConvert.replace(
      / *\(fffe,e00d\): na \(ItemDelimitationItem\) *\n/g,
      '')
    yamlConvert = yamlConvert.replace(
      / *\(fffe,e0dd\): na \(SequenceDelimitationItem\)\n/g,
      '')
    yamlConvert = yamlConvert.replace(
      /(\([0-9a-f][0-9a-f][0-9a-f][0-9a-f],[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\):) (.*)/g,
      '$1 "$2"')
    yamlConvert = yamlConvert.replace(/\\/g, ', ')
    yamlConvert = yamlConvert.replace(/\(fffe,e000\):/g, ' - ')

    yamlConvert = safeLoad(yamlConvert);

    return yamlConvert;
  }

  convertBlockDataToCoords(blockData: string): Coordinates {
    let listString = /\[[, \d\.-]*\]/.exec(blockData).toString();

    let parsedData = JSON.parse('{ "data": ' + listString + '}');

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
    let insert = {
      "x": x,
      "y": y
    };

    return insert;
  }

  dicomPullNumber(input: string): number {
    return Number(input.replace(/.*\[([\d\.-]*)\].*/, "$1"));
  }

  dicomPullString(input: string): string {
    return input.replace(/.*\[(.*)\].*/, "$1");
  }

  getBlockData() {
    let dicomPrint = window['dicomData'];
    let dicomDict = this.convertDicomDumpToDict(dicomPrint);

    // console.log(dicomDict)

    this.insertList = [];

    let beamSequence = dicomDict["(300a,00b0)"];
    for (let beam of beamSequence) {
      let temp = beam["(300a,00f4)"]

      if (temp != undefined) {
        let blockData = beam["(300a,00f4)"][0]["(300a,0106)"];
        let coordinates = this.convertBlockDataToCoords(blockData);

        let applicator = <string> null
        try {
          applicator = this.dicomPullString(
            beam["(300a,0107)"][0]["(300a,0108)"]);
        }
        catch(err) {
          applicator = null
          console.log(err)
        }

        let energy = <number> null
        try {
          energy = this.dicomPullNumber(
            beam["(300a,0111)"][0]["(300a,0114)"]);
        }
        catch(err) {
          energy = null
          console.log(err)
        }

        let ssd = <number> null
        try {
          ssd = this.dicomPullNumber(
            beam["(300a,0111)"][0]["(300a,0130)"]) / 10;
        }
        catch(err) {
          ssd = null
          console.log(err)
        }
        
        let machine = <string> null
        try {
          machine = this.dicomPullString(
          beam["(300a,00b2)"]);
        }
        catch(err) {
          machine = null
          console.log(err)
        }

        let insert = {
          "machine": machine,
          "coordinates": coordinates,
          "applicator": applicator.toLowerCase(),
          "energy": energy,
          "ssd": ssd
        }
        this.insertList.push(insert)
      }

    }
    localStorage.setItem('dicom_insertList', JSON.stringify(this.insertList));
  }

  sendToParameterisation(insert: any) {
    this.insertUpdated(insert['coordinates']);    

    this.insertData['machine'] = insert['machine'];
    this.insertData['parameterisation'] = this.parameterisation
    this.insertData['energy'] = insert['energy'];
    this.insertData['applicator'] = insert['applicator'];
    this.insertData['ssd'] = insert['ssd'];

    localStorage.setItem(
      "last_insertData", JSON.stringify(this.insertData)
    );

    this.router.navigate(["/parameterise"])
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
