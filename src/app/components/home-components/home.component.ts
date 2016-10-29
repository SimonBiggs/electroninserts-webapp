import { Component, OnInit } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'


@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Home');
  }
}
