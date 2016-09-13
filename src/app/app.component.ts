import { Component, OnInit } from '@angular/core';

import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';

import { ElectronApiService } from './electron-api.service';


@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private electronApiService: ElectronApiService,
    private router: Router
  ) { }

  ngOnInit() {
    let redirect = sessionStorage['redirect'];
    delete sessionStorage['redirect'];
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
      this.router.navigate([redirect])
    }
    
    this.electronApiService.wakeUpServer();
  }
}
