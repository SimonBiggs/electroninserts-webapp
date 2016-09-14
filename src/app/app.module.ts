import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { routing } from './app.routing';

import { MdlModule } from 'angular2-mdl';

import { AppComponent }  from './app.component';
import { PlotComponent } from './plot.component';
import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { WidthLengthTableComponent } from './width-length-table.component';
import { JsonInputComponent } from './json-input.component';
import { NotYetImplimentedComponent } from './not-yet-implimented.component';
import { HomeComponent } from './home.component';

import { MyJsonPipe } from './my-json.pipe'

import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';
import { TitleService } from './title.service';
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
    MyJsonPipe,
    NotYetImplimentedComponent,
    HomeComponent
  ],
  providers: [
    ElectronApiService,
    DataService,
    CookieService,
    TitleService,
    Title
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
