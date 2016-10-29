import { Injectable } from '@angular/core';

@Injectable()
export class CurrentSettings {
  machine: string
  energy: number
  applicator: string
  ssd: number

  returnKey() {
    return (
      '{"machine":' + JSON.stringify(String(this.machine)) + ',' +
      '"energy":' + JSON.stringify(Number(this.energy)) + ',' +
      '"applicator":' + JSON.stringify(String(this.applicator)) + ',' +
      '"ssd":' + JSON.stringify(Number(this.ssd)) +
      '}')
  }
}