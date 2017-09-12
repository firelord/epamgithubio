import {EventEmitter, Injectable} from '@angular/core';
import {Project} from '../model/Project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import {Headers, Http, RequestMethod} from '@angular/http';
import {Request} from '@angular/http';


@Injectable()
export class ProjectService {
  searchEvent: EventEmitter<any> = new EventEmitter();

  projects: Observable<Project>;

  constructor(private http: Http) {
    const request = new Request({url: '/orgs/epam/repos/'});
    request.method = RequestMethod.Get;

    request.headers = new Headers({'content-type': 'application/json'});
    this.projects = this.http.request(request).map(response => response.json())
      .publishReplay(3)
      .refCount()
      .flatMap(item => item)
      .map(item => new Project(item['id'], item['name'], item['description'], item['language'], item['html_url']));
  }

  search({language, text}): Observable<Project> {
    let result = this.projects;
    const textInLowerCase = text.toLowerCase();

    result = (text == null || text === '')
      ? result
      : result.filter(item => {
        return item.name.toLowerCase().indexOf(textInLowerCase) !== -1 ||
          (item.description != null && item.description.toLowerCase().indexOf(textInLowerCase) !== -1);
      });

    result = (language == null || language === '')
      ? result
      : result.filter(item => item.language != null && item.language.toLowerCase() === language.toLowerCase());

    return result;
  }
}
