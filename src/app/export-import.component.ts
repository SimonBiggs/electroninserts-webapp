import { Component, OnInit } from '@angular/core';

import { TitleService } from './title.service'

@Component({
  selector: 'my-export-import',
  templateUrl: './export-import.component.html'
})
export class ExportImportComponent implements OnInit {

  constructor(
    private myTitleService: TitleService
  ) {}
  
  ngOnInit() {
    this.myTitleService.setTitle('Export / Import');
  }

}
