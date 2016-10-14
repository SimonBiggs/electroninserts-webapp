import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'my-export-import',
  templateUrl: './export-import.component.html'
})
export class ExportImportComponent implements OnInit {
  testLocalStorage: boolean;
  usedLocalStorageSpace: number;
  remainingLocalStorageSpace: number;

  constructor(
    private myTitleService: TitleService,
    private myLocalStorageService: LocalStorageService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Export / Import');
    this.testLocalStorage = this.myLocalStorageService.isSupported;
    this.usedLocalStorageSpace = this.myLocalStorageService.getUsedSpace();
  }

  testRemainingStorage() {
    this.remainingLocalStorageSpace = this.myLocalStorageService.getRemainingSpace()
  }

}