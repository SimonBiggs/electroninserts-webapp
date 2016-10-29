import { Injectable } from '@angular/core';
import { LocalStorage } from './localstoragemodule';

@Injectable()
export class LocalStorageService {
  isSupported = LocalStorage.isSupported;
  hasItem = LocalStorage.hasItem;
  getRemainingSpace = LocalStorage.getRemainingSpace;
  getMaximumSpace = LocalStorage.getMaximumSpace;
  getUsedSpace = LocalStorage.getUsedSpace;
  getItemUsedSpace = LocalStorage.getItemUsedSpace;
  getBackup = LocalStorage.getBackup;
  applyBackup = LocalStorage.applyBackup;
  consoleInfo = LocalStorage.consoleInfo;
}