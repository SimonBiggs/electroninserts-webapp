import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ElectronApiService } from './electron-api.service';
import { TitleService } from './title.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  pageTitle: string;

  constructor(
    private electronApiService: ElectronApiService,
    private myTitleService: TitleService,
    private router: Router,
    private title:Title,
    angulartics2: Angulartics2, 
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) { 
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        this.pageTitle = this.myTitleService.getTitle();
        this.title.setTitle(
          this.myTitleService.getTitle() + 
          ' | Electron Insert Factor Modelling');
      })
  }

  ngOnInit() {
    // let redirect = sessionStorage['redirect'];
    // delete sessionStorage['redirect'];
    // if (redirect && redirect != location.href) {
    //   history.replaceState(null, null, redirect);
    //   this.router.navigate([redirect])
    // }
    
    this.electronApiService.wakeUpServer();

    this.pageTitle = this.myTitleService.getTitle();
    this.title.setTitle(
      this.myTitleService.getTitle() + 
      ' | Electron Insert Factor Modelling');
  }
}
