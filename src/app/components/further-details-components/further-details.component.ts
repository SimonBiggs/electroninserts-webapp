import { Component, OnInit } from '@angular/core';

import { TitleService } from '../../services/utility-services/title.service'


@Component({
  selector: 'my-further-details',
  templateUrl: './further-details.component.html'
})
export class FurtherDetailsComponent implements OnInit {
  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Further Details');
  }
}
