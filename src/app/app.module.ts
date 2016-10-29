import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { Title } from '@angular/platform-browser'
import { NgZone } from '@angular/core'
// import {MaterialModule} from '@angular/material'

import { routing } from './app.routing'

import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2On } from 'angulartics2/src/core/angulartics2On'

import { MdlModule } from 'angular2-mdl'

import { AppComponent }  from './app.component'
import { PlotComponent } from './plot.component'
import { ParameteriseComponent } from './parameterise.component'
import { PageNotFoundComponent } from './page-not-found.component'
import { WidthLengthTableComponent } from './width-length-table.component'
import { JsonInputComponent } from './json-input.component'
import { HomeComponent } from './home.component'
import { CreateModelComponent } from './create-model.component'
import { UseModelComponent } from './use-model.component'
import { StorageManagementComponent } from './storage-management.component'
import { SpecificationsComponent } from './specifications.component'
import { DicomComponent } from './dicom.component'
import { JsonEditComponent } from './json-edit.component'
import { SendToParameterisationComponent } from './send-to-parameterisation.component'
import { BokehCreateModelComponent } from './bokeh-create-model.component'
import { BokehUseModelComponent } from './bokeh-use-model.component'
import { ChooseSpecificationsComponent } from './choose-specifications.component'
import { WidthLengthAreaInputComponent } from './width-length-area-input.component'

import { MyJsonPipe } from './my-json.pipe'

import { ModelData, ModelMeasurement, ModelGrid, Predictions, AreaLengthConversion } from './model-data'

import { ElectronApiService } from './electron-api.service'
import { DataService } from './data.service'
import { TitleService } from './title.service'
import { LocalStorageService } from './local-storage.service'


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
    HomeComponent,
    CreateModelComponent,
    UseModelComponent,
    StorageManagementComponent,
    SpecificationsComponent,
    DicomComponent,
    SendToParameterisationComponent,
    JsonEditComponent,
    BokehCreateModelComponent,
    BokehUseModelComponent,
    ChooseSpecificationsComponent,
    WidthLengthAreaInputComponent
  ],
  providers: [
    ElectronApiService,
    DataService,
    TitleService,
    Title,
    LocalStorageService,
    Angulartics2GoogleAnalytics,
    ModelData, ModelMeasurement, ModelGrid, Predictions, AreaLengthConversion
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
