import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { MdlDefaultTableModel, IMdlTableModelItem } from 'angular2-mdl';

export interface ITableItem extends IMdlTableModelItem {
  width: number
  length: number
  area: number
  measuredFactor: number
}

@Component({
  selector: 'my-create-insert-table',
  templateUrl: './insert-table.component.html',
})
export class CreateInsertTableComponent implements OnInit {
  @Input()
  width: number[]
  @Input()
  length: number[]
  @Input()
  area: number[]
  @Input()
  measuredFactor: number[]
  @Output()
  selectionChangedEvent = new EventEmitter()
  
  // @Input()
  // enabled: boolean;

  selectionList: boolean[]

  tableData: [ITableItem]

  public tableModel = new MdlDefaultTableModel([
    {key:'width', name:'Width (cm)', sortable:true, numeric:true},
    {key:'length', name:'Length (cm)', sortable:true, numeric:true},
    {key:'area', name:'Area (cm^2)', sortable:true, numeric:true},
    {key:'measuredFactor', name:'Measured Factor', sortable:true, numeric:true}
  ])


  ngOnChanges() {
    console.log('insert-table.component ngOnChanges')
    if (this.tableData != null) {
      this.appendData()
    }
  }

  ngOnInit() {
    console.log('insert-table.component ngOnInit')
    this.appendData()
  }

  appendData() {
    console.log('insert-table.component appendData')

    this.tableData = [
      { 
        width: null, length: null, 
        area: null, measuredFactor: null,
        selected: false
      }
    ]
    for (let i in this.width) {
      this.tableData[i] = { 
        width: null, length: null, 
        area: null, measuredFactor: null,
        selected: false 
      }
      for (let key of ['width', 'length', 'area', 'measuredFactor']) {
        this.tableData[i][key] = this[key][i]
      }

    }
    this.tableModel.data = this.tableData
    this.selectionChanged()
  }

  selectionChanged() {
    console.log('insert-table.component selectionChanged')
    
    this.selectionList = []
    for (let tableItem of this.tableData) {
      this.selectionList.push(tableItem.selected)
    }
    this.selectionChangedEvent.emit(this.selectionList)
  }

}
