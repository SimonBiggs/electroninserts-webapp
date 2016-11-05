import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { MdlDefaultTableModel, IMdlTableModelItem } from 'angular2-mdl';

export interface ITableItem extends IMdlTableModelItem {
  width: number
  length: number
  area: number
  measuredFactor: number
  predictedFactor: number
  difference: number
  canBeAdded: boolean
}

@Component({
  selector: 'my-insert-table',
  templateUrl: './insert-table.component.html',
})
export class InsertTableComponent implements OnInit {
  @Input()
  width: number[]
  @Input()
  length: number[]
  @Input()
  area: number[]
  @Input()
  measuredFactor: number[]
  @Input()
  predictedFactor: number[]
  @Input()
  canBeAdded: boolean[]
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
    {key:'measuredFactor', name:'Measured Factor', sortable:true, numeric:true},
    {key:'predictedFactor', name:'Predicted Factor', sortable:true, numeric:true},
    {key:'difference', name:'Difference', sortable:true, numeric:true},
    {key:'canBeAdded', name:'Able to add to model?'}
  ])


  ngOnChanges() {
    console.log('insert-table.component ngOnChanges')
    if (this.tableData != null) {
      this.appendData()
    }

    // if (this.enabled) {
    //   this.tableData[0].width = this.width;
    //   this.tableData[0].length = this.length;
    // }
    // else {
    //   this.tableData[0].width = null;
    //   this.tableData[0].length = null;
    // }

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
        predictedFactor: null, difference: null,
        canBeAdded: null, selected: false
      }
    ]
    for (let i in this.width) {
      this.tableData[i] = { 
        width: null, length: null, 
        area: null, measuredFactor: null, 
        predictedFactor: null, difference: null, 
        canBeAdded: null, selected: false 
      }
      for (let key of ['width', 'length', 'area', 'measuredFactor', 'predictedFactor', 'canBeAdded']) {
        this.tableData[i][key] = this[key][i]
      }
      this.tableData[i].difference = Math.round((this.predictedFactor[i] - this.measuredFactor[i])*1000)/1000

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
