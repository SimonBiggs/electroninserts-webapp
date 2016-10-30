import { Parameterisation } from './insert-data'
import { Coordinates } from './insert-data'

const insert: Coordinates = {
  x: [
    0.99, -0.14, -1.0, -1.73, -2.56, -3.17, -3.49,
    -3.57, -3.17, -2.52, -1.76, -1.04, -0.17,
    0.77, 1.63, 2.36, 2.79, 2.91, 3.04, 3.22,
    3.34, 3.37, 3.08, 2.54, 1.88, 1.02, 0.99],
  y: [
    5.05, 4.98, 4.42, 3.24, 1.68, 0.6, -0.64,
    -1.48, -2.38, -3.77, -4.81,  -5.26, -5.51,
    -5.58, -5.23, -4.64, -3.77, -2.77, -1.68,
    -0.29, 1.23, 2.68, 3.8, 4.6, 5.01, 5.08, 
    5.05]
}

let parameterisation = new Parameterisation()
parameterisation.reset()
parameterisation.insert = insert

export const DEMO_PARAMETERISE_INPUT = parameterisation

