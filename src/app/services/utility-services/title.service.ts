import { Injectable } from '@angular/core';

@Injectable()
export class TitleService {
  title = 'Home';

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string) {
    this.title = title;
  }

}