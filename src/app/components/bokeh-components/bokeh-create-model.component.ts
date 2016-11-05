import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { BokehPcolour } from './bokeh-pcolour'

declare var Bokeh: any;

@Component({
  selector: 'my-bokeh-create-model',
  templateUrl: './bokeh-plot.html'
})
export class BokehCreateModelComponent extends BokehPcolour implements AfterViewInit, OnChanges {
  @Input()
  title: string = "Figure Title";
  @Input()
  plot_width: number = 300;
  @Input()
  plot_height: number = 300;
  @Input()
  scatter_x: number[];
  @Input()
  scatter_y: number[];
  @Input()
  scatter_z: number[] = [0.5];
  @Input()
  pcolour_x: number[];
  @Input()
  pcolour_y: number[];
  @Input()
  pcolour_z: number[];
  @Input()
  enabled: boolean = true;  
  @Input()
  selectionList: boolean[]

  @ViewChild('bokehplot') bokehplot: any;


  ngOnChanges() {
    this.updateHoverData()
    this.runAllUpdates()
  }

  updateHoverData() {
    if (this.pcolour_data.x != this.pcolour_x) {
      this.pcolour_hover_width = <string[]> []
      for (let x of this.pcolour_x) {
        this.pcolour_hover_width.push(x.toFixed(1))
      }
    }
    if (this.pcolour_data.y != this.pcolour_y) {
      this.pcolour_hover_length = <string[]> []
      for (let y of this.pcolour_y) {
        this.pcolour_hover_length.push(y.toFixed(1))
      }
    }
    if (this.pcolour_data.z != this.pcolour_z) {
      this.pcolour_hover_predicted_factor = <string[]> []
      for (let z of this.pcolour_z) {
        this.pcolour_hover_predicted_factor.push((Math.round(z*1000)/1000).toFixed(3))
      }
    }
  }

  ngAfterViewInit() {
    let hover_tool = new Bokeh.HoverTool({
      tooltips: [
        ["Width", " @hover_width cm"],
        ["Length", " @hover_length cm"],
        ["Predicted Factor", " @hover_predicted_factor"]
      ],
      renderers: [
        this.pcolour_renderer
      ]
    })
    this.fig.add_tools(hover_tool)

    this.doc.add_root(this.fig);
    Bokeh.embed.add_document_standalone(
      this.doc, this.bokehplot.nativeElement); 
  }
}
