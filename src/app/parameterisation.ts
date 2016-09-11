import { Coordinates } from './coordinates'

export class Parameterisation {
  constructor(
    public insert: string, // change this to coords eventually
    public circle?: Coordinates,
    public ellipse?: Coordinates
  ) { }
}