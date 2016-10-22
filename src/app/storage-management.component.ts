import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'my-storage-management',
  templateUrl: './storage-management.component.html'
})
export class StorageManagementComponent implements OnInit {
  testLocalStorage: boolean;
  usedLocalStorageSpace: number;
  remainingLocalStorageSpace: number;

  constructor(
    private myTitleService: TitleService,
    private myLocalStorageService: LocalStorageService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Storage');
    this.testLocalStorage = this.myLocalStorageService.isSupported;
    this.usedLocalStorageSpace = this.myLocalStorageService.getUsedSpace();
  }

  testRemainingStorage() {
    this.remainingLocalStorageSpace = this.myLocalStorageService.getRemainingSpace()
  }

}