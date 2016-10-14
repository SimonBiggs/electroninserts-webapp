import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ElectronApiService {
  // private parameteriseURL = 'http://electronapi.simonbiggs.net/parameterise';
  // private modelURL = 'http://electronapi.simonbiggs.net/model';
  private wakeUpURL = 'http://electronapi.simonbiggs.net/wakeup';

  constructor(private http: Http) { }
  // Initial get from server to wake it up
  wakeUpServer() {
    return this.http
      .get(this.wakeUpURL).toPromise();
  }

  sendToServer(URL:string, input: string): Promise<any> {
    return this.http
            .post(URL, input)
            .toPromise()
            .then((res) => {
              let nan: number = null;
              return res.json()})
            .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


}
