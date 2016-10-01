import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'

@Component({
  selector: 'my-model',
  templateUrl: './model.component.html'
})
export class ModelComponent implements OnInit {

  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Model');
  }

}
