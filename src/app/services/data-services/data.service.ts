import { Injectable } from '@angular/core';
import { Parameterisation } from '../../interfaces/parameterisation'

import { DEMO_PARAMETERISE_INPUT } from './demo-data';
// import { DEMO_MODEL_INPUT } from './demo-data';

@Injectable()
export class DataService {
    getParameterisationData(): Promise<Parameterisation> {
        return Promise.resolve(DEMO_PARAMETERISE_INPUT);
    };
    // getModelData(): Promise<string> {
    //     return Promise.resolve(DEMO_MODEL_INPUT);
    // }
}