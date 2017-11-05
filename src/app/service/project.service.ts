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
import marky from 'marky-markdown';
import {DomSanitizer} from '@angular/platform-browser';
import {CategoryService} from './category.service';
import {Language} from '../model/Language';
import {ProjectDetailInfo} from '../model/ProjectDetailInfo';
import * as moment from 'moment';


@Injectable()
export class ProjectService {
  searchEvent: EventEmitter<any> = new EventEmitter();
  activeProjectEvent: EventEmitter<string> = new EventEmitter();
  projectSelectedEvent: EventEmitter<ProjectDetailInfo> = new EventEmitter();

  constructor(private http: Http,
              private categoryService: CategoryService,
              private sanitizer: DomSanitizer) {
    this.searchEvent.scan((acc, curr) => Object.assign({}, acc, curr), {});
  }

  search(searchObject): Observable<Project[]> {
    const filter = searchObject.filter || '';
    const language = searchObject.language || '';
    const category = searchObject.category || 0;

    let queryParam = `q=org:epam+${filter}+in:name+in:readme`;

    if (language)
      queryParam += `+language=${language}`;

    const request = new Request({url: '/orgs/epam/repos', params: queryParam});
    // const request = new Request({url: 'https://api.github.com/search/repositories', params: queryParam});
    request.method = RequestMethod.Get;
    request.headers = new Headers({'content-type': 'application/json'});

    return this.http.request(request)
      .map(resp => resp.json()['items'])
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
          updatedAt: it['updated_at'],
          forkCount: it['forks_count'],
          issueCount: it['open_issues_count']
        };
      })
      .filter(it => this.categoryService.relatesToCategory(it.name, category))
      .toArray()
      .publishReplay(1).refCount();
  }

  private _requestMd(repoName: string): Observable<string> {
    return this.http.get(`/orgs/EPAM/README.md`)
    // return this.http.get(`https://raw.githubusercontent.com/epam/${repoName}/master/README.md`)
      .map(it => it.text())
      .map(it => this._processText(it))
      .map(it => this.sanitizer.bypassSecurityTrustHtml(marky(it)));
  }

  private _processText(text: string) {
    const strings = text.split('\n')
      .map(it => it.replace(/&nbsp;/g, ''))
      .map(it => it.trim())
      .filter(it =>
        !it.startsWith('=') &&
        !it.startsWith('![') &&
        !it.startsWith('#') &&
        !it.startsWith('|') &&
        !it.startsWith('--') &&
        !it.startsWith('['));

    const excludedLines = this._findLinesOfCode(strings);

    return strings.filter((value, index) => excludedLines.indexOf(index) === -1).join('\n');
  }

  private _findLinesOfCode(strings: string[]): Array<number> {
    const codeLineIndexes = [];
    strings.forEach(
      (str, index) => {
        if (str.startsWith('```'))
          codeLineIndexes.push(index);
      });

    console.log(codeLineIndexes);
    const result = Array<number>();

    for (let _i = 0; _i < codeLineIndexes.length || ((_i + 1) === codeLineIndexes.length); _i = _i + 2)
      for (let _j = codeLineIndexes[_i]; _j <= codeLineIndexes[_i + 1]; _j++)
        result.push(_j);

    return result;
  }

  getProjectDetailInfo(project: Project): ProjectDetailInfo {
    console.log(project);
    return new ProjectDetailInfo(
      project.id,
      project.name,
      project.githubUrl,
      this._requestMd(project.name),
      moment(project.updatedAt).format('on MMM DD, YYYY'),
      this.getLanguages(project.name),
      '',
      this.getCommitCount(project.name),
      this.getContributorCount(project.name),
      project.forkCount,
      project.issueCount
    );
  }

  private getCommitCount(repoName: string): Observable<string> {
    // return this.http.get(`https://api.github.com/repos/epam/${repoName}/commits`)
    //   .map(resp => resp.json())
    //   .flatMap(it => it)
    //   .count(it => true)
    //   .map(it => it.toString());
    return Observable.of('30');
  }

  private getContributorCount(repoName: string): Observable<string> {
    // return this.http.get(`https://api.github.com/repos/epam/${repoName}/contributors`)
    //   .map(resp => resp.json())
    //   .flatMap(it => it)
    //   .count(it => true)
    // .map(it => it.toString());
    return Observable.of('30');
  }

  private getLanguages(repoName: string): Observable<Language[]> {
    return this.http.get(`/languages`)
      .map(resp => resp.json())
      .map(it => this.processLanguagesObject(it));
  }

  private processLanguagesObject(langJson: object): Language[] {
    let nameWithNumbers = Object.keys(langJson)
      .map(name => new NameWithNumber(name, langJson[name]));

    const sum = nameWithNumbers
      .reduce((result, nameWithNumber) => result + nameWithNumber.num, 0);

    nameWithNumbers = this.shortLanguagesListIfNeeded(nameWithNumbers);

    return this.getPercentOfCodeFromLinesOfCode(nameWithNumbers, sum);
  }

  private getPercentOfCodeFromLinesOfCode(nameWithNumbers: NameWithNumber[], sum: number): Language[] {
    const languages = [];
    let tempSumInPercent = 0.0;
    let index = 0;
    const lastIndex = nameWithNumbers.length - 1;
    nameWithNumbers.forEach(it => {
      const percent = (lastIndex === index)
        ? ((Math.trunc (100 - tempSumInPercent) * 100) / 100)
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


