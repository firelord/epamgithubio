import {Observable} from 'rxjs/Observable';

export class Project {
  constructor(public id: number,
              public name: string,
              public description: Observable<string>,
              public language: string,
              public githubUrl) {
  }
}
