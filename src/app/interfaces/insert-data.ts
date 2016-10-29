import { Parameterisation } from './parameterisation'

export class InsertData {
  constructor(
    public machine: string,
    public parameterisation: Parameterisation,
    public energy: number,
    public applicator: string,
    public ssd: number,
    public factor?: number
  ) { }
}