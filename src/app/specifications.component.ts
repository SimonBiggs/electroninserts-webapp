import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'

@Component({
  selector: 'my-specifications',
  templateUrl: './specifications.component.html'
})
export class SpecificationsComponent implements OnInit {

  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Specifications');
  }

}
