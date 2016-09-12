import { Coordinates } from './coordinates'

export class Parameterisation {
  constructor(
    public insert: Coordinates, // change this to coords eventually
    public width?: number,
    public length?: number,
    public circle?: Coordinates,
    public ellipse?: Coordinates
  ) { }
}