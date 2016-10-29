import { Injectable } from '@angular/core';

@Injectable()
export class MachineSpecification {
  machine: string
  makeAndModel: string
  energy: number[]
  R50: number[]
  applicator: string[]
  ssd: number[]
}