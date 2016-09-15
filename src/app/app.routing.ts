import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { NotYetImplimentedComponent } from './not-yet-implimented.component';
import { HomeComponent } from './home.component';
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
    component: NotYetImplimentedComponent
  },
  {
    path: 'specifications',
    component: NotYetImplimentedComponent
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
    component: NotYetImplimentedComponent
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