import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../service/project.service';
import {Project} from '../model/Project';
import {Observable} from 'rxjs/Observable';
import {DomSanitizer} from '@angular/platform-browser';
import marky from 'marky-markdown';
import {Http} from '@angular/http';

@Component({
  selector: 'epamghio-project-detail-info',
  templateUrl: './project-detail-info.component.html',
  styleUrls: ['./project-detail-info.component.css']
})
export class ProjectDetailInfoComponent implements OnInit {
  detail: Project = null;
  readMe: Observable<string> = null;

  constructor(private http: Http,
              private projectService: ProjectService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.detail = this.projectService.projectSelectedEvent.subscribe(
      project => {
        this.detail = project;
        this.readMe = this.http.get(`https://raw.githubusercontent.com/${project.org}/${project.name}/master/README.md`)
          .map(it => it.text())
          .map(it => this._processText(it))
          .map(it => this.sanitizer.bypassSecurityTrustHtml(marky(it)));
      }
    );
  }

  _processText(text: string) {
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

  _findLinesOfCode(strings: string[]): Array<number> {
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
