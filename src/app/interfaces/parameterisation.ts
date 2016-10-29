import { Coordinates } from './coordinates'

export class Parameterisation {
  constructor(
    public insert: Coordinates,
    public width?: number,
    public length?: number,
    public circle?: Coordinates,
    public ellipse?: Coordinates,
    public measuredFactor?: number
  ) { }
}