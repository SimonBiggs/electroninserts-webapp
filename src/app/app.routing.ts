import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ParameteriseComponent } from './components/parameterise-components/parameterise.component';
import { PageNotFoundComponent } from './components/misc-components/page-not-found.component';
import { HomeComponent } from './components/home-components/home.component';
import { CreateModelComponent } from './components/model-components/create-model.component';
import { UseModelComponent } from './components/model-components/use-model.component'
import { StorageManagementComponent } from './components/storage-components/storage-management.component';
import { SpecificationsComponent } from './components/specification-components/specifications.component';
import { DicomComponent } from './components/dicom-components/dicom.component';
import { FurtherDetailsComponent } from './components/further-details-components/further-details.component'


const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'details',
    component: FurtherDetailsComponent
  },
  {
    path: 'storage',
    redirectTo: 'database'
  },
  {
    path: 'database',
    component: StorageManagementComponent
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
    path: 'create-model',
    component: CreateModelComponent
  },
  {
    path: 'use-model',
    component: UseModelComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'model',
    redirectTo: 'create-model'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [
  //Angulartics2GoogleAnalytics
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);