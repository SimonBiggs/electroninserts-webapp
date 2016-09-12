import { Component, OnInit } from '@angular/core';

import { ElectronApiService } from './electron-api.service';


@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private electronApiService: ElectronApiService
  ) { }

  ngOnInit() {
    this.electronApiService.wakeUpServer();
  }

}
