import {Moment} from "moment";

export class Project {
  constructor(public id: number,
              public name: string,
              public category: string,
              public language: string,
              public licence: string,
              public description: string,
              public githubUrl: string,
              public forkCount: number,
              public issueCount: number,
              public updatedAt: Moment) {
  }
}
