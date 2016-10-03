import { Parameterisation } from './parameterisation'

export class InsertData {
  constructor(
    public parameterisation: Parameterisation,
    public energy: number,
    public applicator: string,
    public ssd: number
  ) { }
}