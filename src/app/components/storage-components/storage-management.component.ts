import { Component, OnInit } from '@angular/core';

import Dexie from 'dexie'
import { db } from '../../services/data-services/dexie.service'

import { TitleService } from '../../services/utility-services/title.service'
// import { LocalStorageService } from '../../services/data-services/local-storage.service';
import { DataPersistenceService } from '../../services/data-services/data-persistence.service'

@Component({
  selector: 'my-storage-management',
  templateUrl: './storage-management.component.html'
})
export class StorageManagementComponent implements OnInit {

  databaseDump: string
  reader = new FileReader()
  fileJsonObject: {}

  constructor(
    private myTitleService: TitleService,
    private dataPersistenceService: DataPersistenceService,
  ) {
    this.reader.onload = (event: any) => {
      console.log('storage-management.component this.reader.onload')
      let contents = event.target.result
      this.fileJsonObject = JSON.parse(contents)
    }
  }
  
  ngOnInit() {
    console.log('storage-management.component ngOnInit')
    this.myTitleService.setTitle('Storage');
  }

  exportDataBase() {
    console.log('storage-management.component exportDataBase')
    this.dataPersistenceService.databaseDump()
    .then((stringDump: string) => {
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringDump))
      element.setAttribute('download', 'databaseDump.json')

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    })
  }
  openFile(event: any) {
    console.log('storage-management.component openFile')
    if (typeof event.target !== 'undefined') {
      let file = event.target.files[0]
      if (file) {
        this.reader.readAsText(file)
      }      
    }
    else {
      console.log(event);
    }
  }
}