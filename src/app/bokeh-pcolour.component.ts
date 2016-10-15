import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { Coordinates } from './coordinates';

declare var Bokeh: any;

@Component({
  selector: 'my-bokeh-pcolour',
  templateUrl: './bokeh-pcolour.component.html'
})
export class BokehPcolourComponent implements OnChanges, AfterViewInit, OnInit {
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

  @ViewChild('bokehplot') bokehplot: any;

  plt = Bokeh.Plotting;
  tools = 'pan,crosshair,wheel_zoom,box_zoom,reset,save';  
  fig: any;

  old_scatter_z: number[] = [];
  old_pcolour_z: number[] = [];

  old_scatter_c: string[] = [];
  old_pcolour_c: string[] = [];

  scatter_data = {
    x: <number[]> [],
    y: <number[]> [],
    c: <string[]> []
  }
  scatter_source = new Bokeh.ColumnDataSource({
    data: this.scatter_data
  });

  pcolour_data = {
    x: <number[]> [],
    y: <number[]> [],
    c: <string[]> []
  }
  pcolour_source = new Bokeh.ColumnDataSource({
    data: this.pcolour_data
  });
  doc = new Bokeh.Document();

  ngOnInit() {
    this.fig = this.plt.figure({
        title: this.title, tools: this.tools,
        plot_width: this.plot_width, plot_height: this.plot_height
      });
  }

  ngOnChanges() {
    this.scatter_data = {
      x: <number[]> this.scatter_x,
      y: <number[]> this.scatter_y,
      c: <string[]> this.old_scatter_c
    }
    this.pcolour_data = {
      x: <number[]> this.pcolour_x,
      y: <number[]> this.pcolour_y,
      c: <string[]> this.old_pcolour_c
    }

    if (this.old_scatter_z != this.scatter_z || this.old_pcolour_z != this.pcolour_z) {
      this.scatter_data.c = this.determineFillColours(this.scatter_z, this.pcolour_z);
      this.pcolour_data.c = this.determineFillColours(this.pcolour_z, this.scatter_z);
      
      this.old_scatter_z = this.scatter_z;
      this.old_pcolour_z = this.pcolour_z;

      this.old_scatter_c = this.scatter_data.c;
      this.old_pcolour_c = this.pcolour_data.c;
    }

    if (this.scatter_source.data != this.scatter_data) {
      this.scatter_source.data = this.scatter_data;
    }

    if (this.pcolour_source.data != this.pcolour_data) {
      this.pcolour_source.data = this.pcolour_data;
    }

    if (this.fig != null) {
      if (this.fig.width != this.plot_width) {
        this.fig.width = this.plot_width;
      }
      if (this.fig.height != this.plot_height) {
        this.fig.height = this.plot_height;
      }
    }
  }

  ngAfterViewInit() {
    this.fig.rect(
      { field: 'x' }, { field: 'y' }, 0.1, 0.1, {
        source: this.pcolour_source,
        color:  { field: 'c' }
    });
    this.fig.circle(
      { field: 'x' }, { field: 'y' }, {
        source: this.scatter_source,
        size: 15,
        line_color: 'black',
        fill_color:  { field: 'c' },
        line_width: 2
    });


    // console.log(Bokeh)
    // console.log(this.fig)

    this.doc.add_root(this.fig);
    Bokeh.embed.add_document_standalone(
      this.doc, this.bokehplot.nativeElement); 
  }

  determineFillColours(z1: number[], z2: number[]) {
    let allZ = z1.concat(z2);
    let vmin = Math.min(...allZ);
    let vmax = Math.max(...allZ);
    let vrange = vmax - vmin;
    
    let colour_scale: number[] = [];
    if (vmin == vmax) {
      colour_scale = [0.5];
    }
    else {
      for (let item of z1) {
        colour_scale.push((item - vmin) / vrange);
      }
    }
    let fill_colour: string[] = []
    for (let item of colour_scale) {
      fill_colour.push(this.viridis(item));
    }

    return fill_colour
  }


  /*
  The following functions are adapted from https://github.com/politiken-journalism/scale-color-perceptual.

  Copyright (c) 2015, Politiken Journalism <emil.bay@pol.dk>

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.
  */

  viridis_hex = [
    "#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]

  viridis = this.interpolateArray(this.viridis_hex);

  hex2rgb (hex: string) {
    return {
      // skip # at position 0
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255
    }
  }

  zeroPadHex (hexStr: string) {
    return '00'.slice(hexStr.length) + hexStr
  }

  rgb2hex (rgb: {r:number, g:number, b:number}): string {
    // Map channel triplet into hex color code
    return '#' + [rgb.r, rgb.g, rgb.b]
      // Convert to hex (map [0, 1] => [0, 255] => Z => [0x0, 0xff])
      .map(function (ch) { return Math.round(ch * 255).toString(16) })
      // Make sure each channel is two digits long
      .map(this.zeroPadHex)
      .join('')
  }

  interpolate (a_init: string, b_init: string) {    
    let a = this.hex2rgb(a_init)
    let b = this.hex2rgb(b_init)
    
    let ar = a.r
    let ag = a.g
    let ab = a.b
    let br = b.r - ar
    let bg = b.g - ag
    let bb = b.b - ab

    return (t: number): string => {
      return this.rgb2hex({
        r: ar + br * t,
        g: ag + bg * t,
        b: ab + bb * t
      })
    }
  }

  interpolateArray(scaleArr: string[]) {
    let N = scaleArr.length - 2 // -1 for spacings, -1 for number of interpolate fns
    let intervalWidth = 1 / N
    let intervals: Function[] = [];

    for (let i = 0; i <= N; i++) {
      intervals[i] = this.interpolate(scaleArr[i], scaleArr[i + 1])
    }

    return function (t: number) {
      if (t < 0 || t > 1) throw new Error('Outside the allowed range of [0, 1]')

      let i = Math.floor(t * N)
      let intervalOffset = i * intervalWidth

      return intervals[i](t / intervalWidth - intervalOffset / intervalWidth)
    }
  }

}
