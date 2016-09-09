webpackJsonp([0],{0:function(e,t,n){"use strict";var o=n(1),r=n(3),i=n(24);r.enableProdMode(),o.platformBrowserDynamic().bootstrapModule(i.AppModule)},24:function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=n(3),a=n(22),l=n(25),s=n(29),p=n(30),c=n(81),d=n(86),h=n(82),u=function(){function AppModule(){}return AppModule=o([i.NgModule({imports:[a.BrowserModule,l.FormsModule,s.HttpModule,p.MdlModule],declarations:[c.AppComponent,d.PlotComponent],providers:[h.ElectronApiService],bootstrap:[c.AppComponent]}),r("design:paramtypes",[])],AppModule)}();t.AppModule=u},81:function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=n(3),a=n(82),l=function(){function AppComponent(e){this.electronApiService=e,this.parameteriseInput='{\n  "x": [\n    0.99, -0.14, -1.0, -1.73, -2.56, -3.17, -3.49, -3.57, \n    -3.17, -2.52, -1.76, -1.04, -0.17, 0.77, 1.63, 2.36, \n    2.79, 2.91, 3.04, 3.22, 3.34, 3.37, 3.08, 2.54, 1.88,\n    1.02, 0.99],\n  "y": [\n    5.05, 4.98, 4.42, 3.24, 1.68, 0.6, -0.64, -1.48, \n    -2.38, -3.77, -4.81,  -5.26, -5.51, -5.58, -5.23, \n    -4.64, -3.77, -2.77, -1.68, -0.29, 1.23, 2.68, 3.8, \n    4.6, 5.01, 5.08, 5.05]\n}',this.jsonValid=!0}return AppComponent.prototype.onSubmit=function(){var e=this;this.electronApiService.parameteriseInsert(this.parameteriseInput).then(function(t){return e.parameterisationResult=t})},AppComponent.prototype.checkJSON=function(){this.jsonValid=!1;try{var e=JSON.parse(this.parameteriseInput);"x"in e&&"y"in e?(this.parsedJSON=e,this.parsedJSON.x.length===this.parsedJSON.y.length?this.jsonValid=!0:this.jsonErrorMessage="The length of x doesn't match the length of y."):this.jsonErrorMessage="Either x or y is missing."}catch(t){this.jsonErrorMessage="Error in JSON input. "+t}finally{}},AppComponent.prototype.ngOnInit=function(){this.electronApiService.wakeUpServer()},AppComponent=o([i.Component({selector:"my-app",styles:[n(84)],template:n(85)}),r("design:paramtypes",[a.ElectronApiService])],AppComponent)}();t.AppComponent=l},82:function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=n(3),a=n(29);n(83);var l=function(){function ElectronApiService(e){this.http=e,this.parameteriseURL="http://electronapi.simonbiggs.net/parameterise",this.wakeUpURL="http://electronapi.simonbiggs.net/"}return ElectronApiService.prototype.wakeUpServer=function(){this.http.get(this.wakeUpURL)},ElectronApiService.prototype.parameteriseInsert=function(e){return this.http.post(this.parameteriseURL,e).toPromise().then(function(e){return e.json()})["catch"](this.handleError)},ElectronApiService.prototype.handleError=function(e){return console.error("An error occurred",e),Promise.reject(e.message||e)},ElectronApiService=o([i.Injectable(),r("design:paramtypes",[a.Http])],ElectronApiService)}();t.ElectronApiService=l},84:function(e,t){e.exports=".selected {\n  background-color: #CFD8DC !important;\n  color: white;\n}\n.heroes {\n  margin: 0 0 2em 0;\n  list-style-type: none;\n  padding: 0;\n  width: 15em;\n}\n.heroes li {\n  cursor: pointer;\n  position: relative;\n  left: 0;\n  background-color: #EEE;\n  margin: .5em;\n  padding: .3em 0;\n  height: 1.6em;\n  border-radius: 4px;\n}\n.heroes li.selected:hover {\n  background-color: #BBD8DC !important;\n  color: white;\n}\n.heroes li:hover {\n  color: #607D8B;\n  background-color: #DDD;\n  left: .1em;\n}\n.heroes .text {\n  position: relative;\n  top: -3px;\n}\n.heroes .badge {\n  display: inline-block;\n  font-size: small;\n  color: white;\n  padding: 0.8em 0.7em 0 0.7em;\n  background-color: #607D8B;\n  line-height: 1em;\n  position: relative;\n  left: -1px;\n  top: -4px;\n  height: 1.8em;\n  margin-right: .8em;\n  border-radius: 4px 0 0 4px;\n}\n"},85:function(e,t){e.exports='<mdl-layout mdl-layout-fixed-header mdl-layout-tab-active-index="1">\n      <mdl-layout-header>\n         <mdl-layout-header-row>\n            <mdl-layout-title>Title</mdl-layout-title>\n         </mdl-layout-header-row>\n      </mdl-layout-header>\n      <mdl-layout-drawer>\n         <mdl-layout-title>Title</mdl-layout-title>\n      </mdl-layout-drawer>\n\n\n\n  <mdl-layout-content>\n    <mdl-layout-tab-panel mdl-layout-tab-panel-title="Dicom">\n\n    </mdl-layout-tab-panel>\n    <mdl-layout-tab-panel mdl-layout-tab-panel-title="Parameterise">\n      <div class="row">\n        <div class="col-xs-12 col-md-6">\n\n          <mdl-textfield \n            label="Parameterisation input" \n            [(ngModel)]="parameteriseInput" \n            rows="13" maxrows="13" \n            floating-label style="width:100%">\n          </mdl-textfield>\n\n          <button mdl-button mdl-button-type="raised" mdl-colored="primary" mdl-ripple (click)="onSubmit()">\n            Submit\n          </button>\n\n          <div *ngIf="parameterisationResult">\n            <p>Width: {{parameterisationResult.width}}</p>\n            <p>Length: {{parameterisationResult.length}}</p>\n          </div>\n\n        </div>\n        <div class="col-xs-12 col-md-6">\n          <div class="bk-root" style="height:300px">\n          <my-plot \n            [parameteriseInput]="parameteriseInput">\n          </my-plot>\n          </div>\n\n        </div>\n\n      </div>\n    </mdl-layout-tab-panel>\n    <mdl-layout-tab-panel mdl-layout-tab-panel-title="Model">\n\n    </mdl-layout-tab-panel>\n\n  </mdl-layout-content>\n</mdl-layout>\n\n\n\n'},86:function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=n(3),a=function(){function PlotComponent(){this.jsonValid=!0,this.plt=Bokeh.Plotting,this.tools="pan,crosshair,wheel_zoom,box_zoom,reset,save",this.xrange=Bokeh.Range1d(-6,6),this.yrange=Bokeh.Range1d(-6,6),this.fig=this.plt.figure({title:"Electron Insert Plot",tools:this.tools,plot_width:300,plot_height:300,x_range:this.xrange,y_range:this.yrange}),this.source=new Bokeh.ColumnDataSource,this.doc=new Bokeh.Document}return PlotComponent.prototype.ngOnChanges=function(){this.jsonValid=!1;try{var e=JSON.parse(this.parameteriseInput);"x"in e&&"y"in e?(this.parsedJSON=e,this.parsedJSON.x.length===this.parsedJSON.y.length?(this.source.data=this.parsedJSON,this.jsonValid=!0):this.jsonErrorMessage="The length of x doesn't match the length of y."):this.jsonErrorMessage="Either x or y is missing."}catch(t){this.jsonErrorMessage="Error in JSON input. "+t}finally{}},PlotComponent.prototype.ngAfterViewInit=function(){this.source.data=JSON.parse(this.parameteriseInput),this.fig.line({field:"x"},{field:"y"},{source:this.source,line_width:3}),this.doc.add_root(this.fig),Bokeh.embed.add_document_standalone(this.doc,this.bokehplot.nativeElement)},o([i.Input(),r("design:type",String)],PlotComponent.prototype,"parameteriseInput",void 0),o([i.ViewChild("bokehplot"),r("design:type",Object)],PlotComponent.prototype,"bokehplot",void 0),PlotComponent=o([i.Component({selector:"my-plot",template:n(87),styles:[n(88)]}),r("design:paramtypes",[])],PlotComponent)}();t.PlotComponent=a},87:function(e,t){e.exports='\n  <div class="bk-root" style="height:300px">\n    <div #bokehplot></div>\n  </div>\n\n\n  <div [hidden]="jsonValid" class="alert alert-danger">\n      {{jsonErrorMessage}}\n  </div>\n'},88:function(e,t){e.exports=""}});
//# sourceMappingURL=app.ed8cc5c2e3d3e8aeaab8.js.map