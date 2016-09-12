import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing,
         appRoutingProviders } from './app.routing';

import { MdlModule } from 'angular2-mdl';

import { AppComponent }  from './app.component';
import { PlotComponent } from './plot.component';
import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { WidthLengthTableComponent } from './width-length-table.component';
import { JsonInputComponent } from './json-input.component';

import { MyJsonPipe } from './my-json.pipe'

import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';
import { CookieService } from 'angular2-cookie/core';

@NgModule({
  imports: [
     BrowserModule,
     FormsModule,
     HttpModule,
     MdlModule,
     routing
  ],
  declarations: [
    AppComponent,
    ParameteriseComponent,
    PlotComponent,
    PageNotFoundComponent,
    WidthLengthTableComponent,
    JsonInputComponent,
    MyJsonPipe
  ],
  providers: [
    ElectronApiService,
    DataService,
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
