import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParameteriseComponent } from './parameterise.component';
import { PageNotFoundComponent } from './page-not-found.component';


const appRoutes: Routes = [
  {
    path: 'parameterise',
    component: ParameteriseComponent
  },
  {
    path: '',
    redirectTo: '/parameterise',
    pathMatch: 'full'
  },
  {
      path: '**', component: PageNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);