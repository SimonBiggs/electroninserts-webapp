import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { MdlDefaultTableModel } from 'angular2-mdl';

@Component({
  selector: 'my-width-length-table',
  templateUrl: '../misc-components/shared-table-template.html',
})
export class WidthLengthTableComponent implements OnInit {
  @Input()
  width: number;
  @Input()
  length: number;
  @Input()
  enabled: boolean;

  tableData:[any] = [
      {width:null, length:null}
  ];

  public tableModel = new MdlDefaultTableModel([
        {key:'width', name:'Width', sortable:true, numeric:true},
        {key:'length', name:'Length', sortable:true, numeric:true}
      ]);

  ngOnChanges() {
    if (this.enabled) {
      this.tableData[0].width = this.width;
      this.tableData[0].length = this.length;
    }
    else {
      this.tableData[0].width = null;
      this.tableData[0].length = null;
    }

  }

  ngOnInit() {
    this.tableModel.addAll(this.tableData);
  }

}
