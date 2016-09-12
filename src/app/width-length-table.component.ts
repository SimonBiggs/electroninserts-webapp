import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { MdlDefaultTableModel } from 'angular2-mdl';

@Component({
  selector: 'my-width-length-table',
  templateUrl: 'width-length-table.component.html',
})
export class WidthLengthTableComponent implements OnInit {
  @Input()
  width: number;
  @Input()
  length: number;

  tableData:[any] = [
      {width:null, length:null}
  ];

  public tableModel = new MdlDefaultTableModel([
        {key:'width', name:'Width', sortable:true, numeric:true},
        {key:'length', name:'Length', sortable:true, numeric:true}
      ]);

  ngOnChanges() {
    this.tableData[0].width = this.width;
    this.tableData[0].length = this.length;
  }

  ngOnInit() {
    this.tableModel.addAll(this.tableData);
  }

}
