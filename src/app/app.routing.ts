import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { NotYetImplimentedComponent } from './not-yet-implimented.component';
import { HomeComponent } from './home.component';
import { ModelComponent } from './model.component';
import { ExportImportComponent } from './export-import.component';
import { SpecificationsComponent } from './specifications.component';
import { DicomComponent } from './dicom.component';


const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'export-import',
    component: ExportImportComponent
  },
  {
    path: 'specifications',
    component: SpecificationsComponent
  },
  {
    path: 'dicom',
    component: DicomComponent
  },
  {
    path: 'parameterise',
    component: ParameteriseComponent
  },
  {
    path: 'model',
    component: ModelComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);