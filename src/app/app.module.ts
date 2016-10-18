import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { NgZone } from '@angular/core';
// import {MaterialModule} from '@angular/material';

import { routing } from './app.routing';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { Angulartics2Module } from 'angulartics2';

import { MdlModule } from 'angular2-mdl';

import { AppComponent }  from './app.component';
import { PlotComponent } from './plot.component';
import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { WidthLengthTableComponent } from './width-length-table.component';
import { JsonInputComponent } from './json-input.component';
import { NotYetImplimentedComponent } from './not-yet-implimented.component';
import { HomeComponent } from './home.component';
import { ModelComponent } from './model.component';
import { ExportImportComponent } from './export-import.component';
import { SpecificationsComponent } from './specifications.component';
import { DicomComponent } from './dicom.component';
import { JsonEditComponent } from './json-edit.component';
import { SendToParameterisationComponent } from './send-to-parameterisation.component';
import { BokehPcolourComponent } from './bokeh-pcolour.component';

import { MyJsonPipe } from './my-json.pipe'

import { ElectronApiService } from './electron-api.service';
import { DataService } from './data.service';
import { TitleService } from './title.service';
// import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from './local-storage.service';
// import {WEB_STORAGE_PROVIDERS} from "h5webstorage";

@NgModule({
  imports: [
     BrowserModule,
     FormsModule,
     HttpModule,
     MdlModule,
    //  MaterialModule.forRoot(),
     routing,
     Angulartics2Module.forRoot()
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
    HomeComponent,
    ModelComponent,
    ExportImportComponent,
    SpecificationsComponent,
    DicomComponent,
    SendToParameterisationComponent,
    JsonEditComponent,
    BokehPcolourComponent
  ],
  providers: [
    ElectronApiService,
    DataService,
    TitleService,
    Title,
    LocalStorageService,
    Angulartics2GoogleAnalytics
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
