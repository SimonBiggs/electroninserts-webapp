import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myJson', pure: false})
export class MyJsonPipe implements PipeTransform {
  transform(input: {}): string {
    let jsonText = JSON.stringify(input, null, 4)
    jsonText = jsonText.replace(/(-?\d+(\.\d+)?),\n\s*/g, "$1, ");
    jsonText = jsonText.replace(/null,\n\s*/g, "null, ");
    // jsonText = jsonText.replace(/:/g, ":\n");
    return jsonText
  }
}