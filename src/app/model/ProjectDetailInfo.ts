import {Language} from './Language';
import {Observable} from "rxjs/Observable";

export class ProjectDetailInfo {
  constructor(public id: number,
              public name: string,
              public githubUrl: string,
              public readMe: Observable<string>,
              public lastUpdated: string,
              public languages: Observable<Language[]>,
              public licence: string,
              public commitCount: Observable<string>,
              public contributorCount: Observable<string>,
              public forkCount: string,
              public issueCount: string) {
  }
}
