import { OnInit } from '@angular/core';

declare var Bokeh: any;

export class BokehPcolour implements OnInit {
  title: string = "Figure Title";
  plot_width: number = 300;
  plot_height: number = 300;
  scatter_x: number[];
  scatter_y: number[];
  scatter_z: number[] = [0.5];
  pcolour_x: number[];
  pcolour_y: number[];
  pcolour_z: number[];
  enabled: boolean = true;

  pcolour_hover_width: string[] = [];
  pcolour_hover_length: string[] = [];
  pcolour_hover_predicted_factor: string[] = [];

  scatter_hover_width: string[] = [];
  scatter_hover_length: string[] = [];
  scatter_hover_area: string[] = [];
  scatter_hover_measured_factor: string[] = [];
  scatter_hover_predicted_factor: string[] = [];

  plt = Bokeh.Plotting;
  tools = 'pan,crosshair,wheel_zoom,box_zoom,reset,save';  
  fig: any;

  old_scatter_z: number[] = [];
  old_pcolour_z: number[] = [];

  scatter_c: string[] = [];
  pcolour_c: string[] = [];

  scatter_data = {
    x: <number[]> [],
    y: <number[]> [],
    z: <number[]> [],
    hover_width: <string[]> [],
    hover_length: <string[]> [],
    hover_area: <string[]> [],
    hover_measured_factor: <string[]> [],
    hover_predicted_factor: <string[]> [],
    c: <string[]> []
  }
  scatter_source = new Bokeh.ColumnDataSource({
    data: this.scatter_data
  });

  pcolour_renderer: any
  scatter_renderer: any

  pcolour_data = {
    x: <number[]> [],
    y: <number[]> [],
    z: <number[]> [],
    hover_width: <string[]> [],
    hover_length: <string[]> [],
    hover_predicted_factor: <string[]> [],
    c: <string[]> []
  }
  pcolour_source = new Bokeh.ColumnDataSource({
    data: this.pcolour_data
  });
  doc = new Bokeh.Document();

  viridis_hex = [
    "#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]

  vmin: number;
  vmax: number;
  colour_mapper = new Bokeh.LinearColorMapper({
    palette: this.viridis_hex
  })
  ticker = new Bokeh.BasicTicker()
  colour_bar = new Bokeh.ColorBar({
    ticker: this.ticker,
    label_standoff: 7,
    location: [-6,0]
  })

  ngOnInit() {
    this.figureInitialise()
  }

  figureInitialise() {
    this.fig = this.plt.figure({
        title: this.title, tools: this.tools,
        plot_width: this.plot_width, plot_height: this.plot_height
      });

    this.pcolour_renderer = this.fig.rect(
      { field: 'x' }, { field: 'y' }, 0.1, 0.1, {
        source: this.pcolour_source,
        color:  { field: 'c' }
    });

    this.scatter_renderer = this.fig.circle(
      { field: 'x' }, { field: 'y' }, {
        source: this.scatter_source,
        size: 15,
        line_color: 'black',
        fill_color:  { field: 'c' },
        line_width: 2
    });

    this.fig.add_layout(this.colour_bar, 'left')
  }

  runAllUpdates() {
    this.updateScatterData()
    this.updatePcolourData()
    this.updateScatterColour()

    this.updateSourceData()

    this.updateFigureDimensions()
  }

  updateScatterData() {
    this.scatter_data = {
      x: <number[]> this.scatter_x,
      y: <number[]> this.scatter_y,
      z: <number[]> this.scatter_z,
      hover_width: <string[]> this.scatter_hover_width,
      hover_length: <string[]> this.scatter_hover_length,
      hover_area: <string[]> this.scatter_hover_area,
      hover_measured_factor: <string[]> this.scatter_hover_measured_factor,
      hover_predicted_factor: <string[]> this.scatter_hover_predicted_factor,
      c: <string[]> this.scatter_c
    }
  }

  updatePcolourData() {
    this.pcolour_data = {
      x: <number[]> this.pcolour_x,
      y: <number[]> this.pcolour_y,
      z: <number[]> this.pcolour_z,
      hover_width: <string[]> this.pcolour_hover_width,
      hover_length: <string[]> this.pcolour_hover_length,
      hover_predicted_factor: <string[]> this.pcolour_hover_predicted_factor,
      c: <string[]> this.pcolour_c
    }
  }

  updateScatterColour() {
    if (this.old_scatter_z != this.scatter_z || this.old_pcolour_z != this.pcolour_z) {
      let allZ = this.scatter_z.concat(this.pcolour_z);
      this.vmin = Math.min(...allZ);
      this.vmax = Math.max(...allZ);

      this.colour_mapper.low = this.vmin
      this.colour_mapper.high = this.vmax
      this.colour_bar.color_mapper = this.colour_mapper

      this.scatter_c = this.colour_mapper.v_compute(this.scatter_z)
      this.pcolour_c = this.colour_mapper.v_compute(this.pcolour_z)

      this.scatter_data.c = this.scatter_c
      this.pcolour_data.c = this.pcolour_c

      this.old_scatter_z = this.scatter_z;
      this.old_pcolour_z = this.pcolour_z;

      if (this.scatter_data.c.length < this.scatter_data.x.length) {
        let difference = this.scatter_data.x.length - this.scatter_data.c.length
        for (let i=0; i < difference; i++) {
          this.scatter_data.c.push('#ffffff')
        }
      }
    }
  }

  updateSourceData() {
    if (this.scatter_source.data != this.scatter_data) {
      this.scatter_source.data = this.scatter_data;
    }

    if (this.pcolour_source.data != this.pcolour_data) {
      this.pcolour_source.data = this.pcolour_data;
    }
  }

  updateFigureDimensions() {
    if (this.fig != null) {
      if (this.fig.width != this.plot_width) {
        if (this.plot_width < 200) {
          this.fig.width = 200
        }
        else {
          this.fig.width = this.plot_width;
        }        
      }
      if (this.fig.height != this.plot_height) {
        this.fig.height = this.plot_height;
      }
    }
  }
}
