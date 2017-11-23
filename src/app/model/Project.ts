import {Moment} from 'moment';
import {Language} from './Language';

export class Project {
  constructor(public id: number,
              public name: string,
              public org: string,
              public category: string,
              public language: string,
              public licence: string,
              public description: string,
              public githubUrl: string,
              public forkCount: number,
              public issueCount: number,
              public commitCount: number,
              public contributorCount: number,
              public languages: Language[],
              public updatedAt: Moment) {
  }
}
