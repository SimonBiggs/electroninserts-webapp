import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MdlModule } from 'angular2-mdl';

import { AppComponent }  from './app.component';
import { PlotComponent } from './plot.component';


import { ElectronApiService } from './electron-api.service';

@NgModule({
  imports: [
     BrowserModule,
     FormsModule,
     HttpModule,
     MdlModule
  ],
  declarations: [
    AppComponent,
    PlotComponent
  ],
  providers: [
    ElectronApiService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
