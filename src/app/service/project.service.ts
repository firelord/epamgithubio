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


@Injectable()
export class ProjectService {
  searchEvent: EventEmitter<any> = new EventEmitter();
  activeProjectEvent: EventEmitter<string> = new EventEmitter();

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

    this.http.get(`/orgs/EPAM/README.md`)
      .map(it => it.text())
      .subscribe(
        it => this._processText(it)
      );

    const request = new Request({url: '/orgs/epam/repos', params: queryParam});
    // const request = new Request({url: 'https://api.github.com/search/repositories', params: queryParam});
    request.method = RequestMethod.Get;
    request.headers = new Headers({'content-type': 'application/json'});

    return this.http.request(request)
      .map(resp => resp.json()['items'])
      .flatMap(it => it)
      .map(item => new Project(
        item['id'],
        item['name'],
        this.categoryService.getCategory(item['name']),
        item['language'],
        'Apache-2.0',
        item['description'])
      )
      .filter(it => this.categoryService.relatesToCategory(it.name, category))
      .toArray();
  }

  private _requestMd(repoName: string): Observable<string> {
    // return this.http.get(`/orgs/EPAM/README.md`)
    return this.http.get(`https://raw.githubusercontent.com/epam/${repoName}/master/README.md`)
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

    strings.filter((value, index) => excludedLines.indexOf(index) !== -1);

    const result = strings.join('\n');
    return result.length > 300 ? result.substring(0, 300) + '...' : result;
  }

  private _findLinesOfCode(strings: string[]): Array<number> {
    const codeLineIndexes = [];
    strings.forEach(
      (str, index) => {
        if (str.startsWith('```'))
          codeLineIndexes.push(index);
      });

    const result = Array<number>();

    for (let _i = 0; _i < codeLineIndexes.length || ((_i + 1) === codeLineIndexes.length); _i = _i + 2)
      for (let _j = codeLineIndexes[_i]; _j <= codeLineIndexes[_i + 1]; _j++)
        result.push(_j);

    return result;
  }
}
