import {EventEmitter, Injectable} from '@angular/core';
import {Project} from '../model/Project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/publishReplay';
import {Headers, Http, Request, RequestMethod} from '@angular/http';
import {CategoryService} from './category.service';
import {Language} from '../model/Language';
import * as moment from 'moment';

@Injectable()
export class ProjectService {
  searchEvent: EventEmitter<any> = new EventEmitter();
  search$ = this.searchEvent.scan((acc, curr) => Object.assign({}, acc, curr), {});
  activeProjectEvent: EventEmitter<string> = new EventEmitter();
  projectSelectedEvent: EventEmitter<Project> = new EventEmitter();

  constructor(private http: Http, private categoryService: CategoryService) {
  }

  search(searchObject): Observable<Project[]> {
    const filter = searchObject.filter || '';
    const language = searchObject.language || '';
    const category = searchObject.category || 0;
    const sortOrder = searchObject.orderByAscUpdatedAt;

    const request = this.buildRequestToServer(filter, language);

    const compareFn = sortOrder
      ? ((a, b) => a.updatedAt.unix() - b.updatedAt.unix())
      : ((a, b) => b.updatedAt.unix() - a.updatedAt.unix());

    return this.http.request(request)
      .map(resp => resp.json())
      .flatMap(it => it)
      .map(it => {
        return {
          id: it['id'],
          name: it['name'],
          category: this.categoryService.getCategory(it['name']),
          language: it['language'],
          licence: 'Apache-2.0',
          description: it['description'],
          githubUrl: it['html_url'],
          updatedAt: moment(it['updated_at']),
          forkCount: it['forks_count'],
          issueCount: it['open_issues_count'],
          commitCount: it['commitCount'],
          contributorCount: it['contributorCount'],
          org: it['owner'].login,
          languages: this.processLanguagesObject(it['languages']),
        };
      })
      .filter(it => this.categoryService.relatesToCategory(it.name, category))
      .toArray()
      .map(it => it.sort(compareFn))
      .publishReplay(1).refCount();
  }

  private buildRequestToServer(filter: string, language: string) {
    const queryParams = [];

    if (filter.length > 0)
      queryParams.push(`filter=${filter}`);

    if (language)
      queryParams.push(`language=${encodeURIComponent(language)}`);

    const urlParams = queryParams.length > 0 ? '' + queryParams.join('&') : '';

    const request = new Request({
      url: 'repo/all',
      params: urlParams
    });

    request.method = RequestMethod.Get;
    request.headers = new Headers({'content-type': 'application/json'});
    return request;
  }

  private processLanguagesObject(langJson: object): Language[] {
    let nameWithNumbers = Object.keys(langJson)
      .map(name => new NameWithNumber(name, langJson[name]));

    const sum = nameWithNumbers
      .reduce((result, nameWithNumber) => result + nameWithNumber.num, 0);

    nameWithNumbers = this.shortLanguagesListIfNeeded(nameWithNumbers);

    return this.getPercentOfCodeFromLinesOfCode(nameWithNumbers, sum)
      .filter(it => it.percent > 0.01);
  }

  private getPercentOfCodeFromLinesOfCode(nameWithNumbers: NameWithNumber[], sum: number): Language[] {
    const languages = [];
    let tempSumInPercent = 0.0;
    let index = 0;
    const lastIndex = nameWithNumbers.length - 1;
    nameWithNumbers.forEach(it => {
      const percent = (lastIndex === index)
        ? ((Math.trunc(100 - tempSumInPercent) * 100) / 100)
        : (Math.trunc((it.num * 100 / sum) * 100) / 100);

      tempSumInPercent += percent;
      languages.push(new Language(it.name, percent));
      index++;
    });

    return languages;
  }

  private shortLanguagesListIfNeeded(nameWithNumbers: NameWithNumber[]): NameWithNumber[] {
    return nameWithNumbers.length > 3
      ? nameWithNumbers.slice(0, 3).concat(new NameWithNumber(
        'Others',
        nameWithNumbers.slice(3).reduce((acc, it) => acc + it.num, 0)))
      : nameWithNumbers;
  }
}

class NameWithNumber {
  constructor(public name: string, public num: number) {
  }
}
