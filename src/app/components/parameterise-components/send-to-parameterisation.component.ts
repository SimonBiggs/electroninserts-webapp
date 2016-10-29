import { Component, OnInit, Input} from '@angular/core';

import { Coordinates } from '../../interfaces/coordinates';

import { MdlDefaultTableModel } from 'angular2-mdl';

@Component({
  selector: 'my-send-to-parameterisation',
  templateUrl: 'send-to-parameterisation.component.html',
})
export class SendToParameterisationComponent implements OnInit {
  @Input()
  applicator: string;
  @Input()
  machine: string;
  @Input()
  energy: number;
  @Input()
  ssd: number;
  @Input()
  coordinates: Coordinates;

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
    this.tableData[0].machine = this.machine;
    this.tableData[0].applicator = this.applicator;
    this.tableData[0].energy = this.energy;
    this.tableData[0].ssd = this.ssd;
    this.tableModel.addAll(this.tableData);
  }

}
