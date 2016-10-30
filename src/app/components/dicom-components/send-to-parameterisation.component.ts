import { Component, OnInit, Input} from '@angular/core';

import { Coordinates } from '../../services/data-services/insert-data'
import { InsertData } from '../../services/data-services/insert-data'

import { MdlDefaultTableModel } from 'angular2-mdl';

@Component({
  selector: 'my-send-to-parameterisation',
  templateUrl: 'send-to-parameterisation.component.html',
})
export class SendToParameterisationComponent implements OnInit {
  @Input()
  insertData: InsertData

  tableData:[any] = [
      {machine:null, applicator:null, energy:null, ssd:null}
  ];

  public tableModel = new MdlDefaultTableModel([
        {key:'machine', name:'Machine', sortable:true, numeric:false},
        {key:'applicator', name:'App', sortable:true, numeric:false},
        {key:'energy', name:'Eng', sortable:true, numeric:true},
        {key:'ssd', name:'SSD', sortable:true, numeric:true}
      ]);

  ngOnInit() {
    this.tableData[0].machine = this.insertData.machine;
    this.tableData[0].applicator = this.insertData.applicator;
    this.tableData[0].energy = this.insertData.energy;
    this.tableData[0].ssd = this.insertData.ssd;
    this.tableModel.addAll(this.tableData);
  }

}
