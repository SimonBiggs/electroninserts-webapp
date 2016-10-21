import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'

@Component({
  selector: 'my-use-model',
  templateUrl: './use-model.component.html'
})
export class UseModelComponent {
  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Use Model');
  }
}