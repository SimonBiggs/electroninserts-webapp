import { Pipe, PipeTransform } from '@angular/core';

import { Coordinates } from './coordinates';

@Pipe({name: 'myJson', pure: false})
export class MyJsonPipe implements PipeTransform {
  transform(input: {}): string {
    let jsonText = JSON.stringify(input)
    jsonText = jsonText.replace(/,/g, ", ");
    return jsonText
  }
}