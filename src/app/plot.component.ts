import { Component, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';

import { Coordinates } from './coordinates';

declare var Bokeh: any;

@Component({
  selector: 'my-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnChanges, AfterViewInit {
  @Input()
  insert: Coordinates;
  @Input()
  circle: Coordinates;
  @Input()
  ellipse: Coordinates;

  parsedJSON: any;
  tempSource: any;
  jsonValid: boolean = true;
  jsonErrorMessage: string;

  @ViewChild('bokehplot') bokehplot: any;

  plt = Bokeh.Plotting;
  tools = 'pan,crosshair,wheel_zoom,box_zoom,reset,save';
  xrange = Bokeh.Range1d(-6, 6);
  yrange = Bokeh.Range1d(-6, 6);
  fig = this.plt.figure({
    title: 'Electron Insert Plot', tools: this.tools,
    plot_width: 300, plot_height: 300,
    x_range: this.xrange, y_range: this.yrange
  });
  source = new Bokeh.ColumnDataSource();
  doc = new Bokeh.Document();


  ngOnChanges() {
    this.jsonValid = false;
    this.tempSource = {
      "xs": [[0], [0], [0]],
      "ys": [[0], [0], [0]],
      "colour": ["navy", "firebrick", "green"]
    }
    if (this.insert) {
      if ('x' in this.insert && 'y' in this.insert) {
        this.tempSource.xs[0] = this.insert.x
        this.tempSource.ys[0] = this.insert.y
      }
    }

    if (this.circle) {
      if ('x' in this.circle && 'y' in this.circle) {
        this.tempSource.xs[1] = this.circle.x
        this.tempSource.ys[1] = this.circle.y
      }
    }
    if (this.ellipse) {
      if ('x' in this.ellipse && 'y' in this.ellipse) {
        this.tempSource.xs[2] = this.ellipse.x
        this.tempSource.ys[2] = this.ellipse.y
      }
    }

    this.source.data = this.tempSource;
  }

  ngAfterViewInit() {
    this.ngOnChanges();

    this.fig.multi_line({ field: 'xs' }, { field: 'ys' }, {
      source: this.source,
      line_width: 2,
      color: { field: 'colour' }
    });
    
    this.doc.add_root(this.fig);
    Bokeh.embed.add_document_standalone(
      this.doc, this.bokehplot.nativeElement);
  }
}
