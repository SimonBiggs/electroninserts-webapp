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

import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';

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
    PageNotFoundComponent
  ],
  providers: [
    ElectronApiService,
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
