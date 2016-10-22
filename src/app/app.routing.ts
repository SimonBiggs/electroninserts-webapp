import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { HomeComponent } from './home.component';
import { CreateModelComponent } from './create-model.component';
import { UseModelComponent } from './use-model.component'
import { StorageManagementComponent } from './storage-management.component';
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
    path: 'storage',
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
    path: '**', component: PageNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [
  //Angulartics2GoogleAnalytics
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);