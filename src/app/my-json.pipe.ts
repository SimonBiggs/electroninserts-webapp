import { Pipe, PipeTransform } from '@angular/core';

import { Coordinates } from './coordinates';

@Pipe({name: 'myJson', pure: false})
export class MyJsonPipe implements PipeTransform {
  transform(insert: Coordinates): string {
    let jsonText = JSON.stringify(insert)
    jsonText = jsonText.replace(/,/g, ", ");
    return jsonText
  }
}