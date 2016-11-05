import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { BokehPcolour } from './bokeh-pcolour'

declare var Bokeh: any;

@Component({
  selector: 'my-bokeh-use-model',
  templateUrl: './bokeh-plot.html'
})
export class BokehUseModelComponent extends BokehPcolour implements AfterViewInit, OnChanges {
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
  predicted_factor: number[] = []
  @Input()
  selectionList: boolean[]
  @Input()
  area: number[] = []

  old_area: number[] = []
  old_predicted_factor: number[] = []

  @ViewChild('bokehplot') bokehplot: any;


  ngOnChanges() {
    console.log('bokeh-use-model.component ngOnChanges')
    this.updateHoverData()
    this.runAllUpdates()
  }

  updateHoverData() {
    console.log('bokeh-use-model.component updateHoverData')
    if (this.scatter_data.x != this.scatter_x) {
      this.scatter_hover_width = <string[]> []
      for (let x of this.scatter_x) {
        this.scatter_hover_width.push((Math.round(x*10)/10).toFixed(1))
      }
    }
    if (this.scatter_data.y != this.scatter_y) {
      this.scatter_hover_length = <string[]> []
      for (let y of this.scatter_y) {
        this.scatter_hover_length.push((Math.round(y*10)/10).toFixed(1))
      }
    }
    if (this.scatter_data.z != this.scatter_z) {
      this.scatter_hover_measured_factor = <string[]> []
      for (let z of this.scatter_z) {
        this.scatter_hover_measured_factor.push((Math.round(z*1000)/1000).toFixed(3))
      }
      if (this.scatter_hover_measured_factor.length < this.scatter_x.length) {
        let difference = this.scatter_x.length - this.scatter_hover_measured_factor.length
        for (let i=0; i < difference; i++) {
          this.scatter_hover_measured_factor.push('Not given')
        }
      }
    }
    if (this.old_predicted_factor != this.predicted_factor) {
      this.scatter_hover_predicted_factor = <string[]> []
      for (let z of this.predicted_factor) {
        this.scatter_hover_predicted_factor.push((Math.round(z*1000)/1000).toFixed(3))
      }
      this.old_predicted_factor = this.predicted_factor
    }
    if (this.old_area != this.area) {
      this.scatter_hover_area = <string[]> []
      for (let a of this.area) {
        this.scatter_hover_area.push((Math.round(a*10)/10).toFixed(1))
      }
      this.old_area = this.area
    }
  }

    // hover_width: <string[]> [],
    // hover_length: <string[]> [],
    // hover_area: <string[]> [],
    // hover_measured_factor: <string[]> [],
    // hover_predicted_factor: <string[]> [],

  ngAfterViewInit() {
    console.log('bokeh-use-model.component ngAfterViewInit')
    let hover_tool = new Bokeh.HoverTool({
      tooltips: [
        ["Width", " @hover_width cm"],
        ["Length", " @hover_length cm"],
        ["Area", " @hover_area cm^2"],
        ["Measured factor", " @hover_measured_factor"],
        ["Predicted factor", " @hover_predicted_factor"],
        // ["Predicted - Measured", " @hover_difference"]
      ],
      renderers: [
        this.scatter_renderer
      ]
    })
    this.fig.add_tools(hover_tool)

    this.doc.add_root(this.fig);
    Bokeh.embed.add_document_standalone(
      this.doc, this.bokehplot.nativeElement); 
  }
}
