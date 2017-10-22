import {Component, Input, OnInit} from '@angular/core';
import {ProjectSearchRequest} from '../model/ProjectSearchRequest';
import {ProjectService} from '../service/project.service';
import {Project} from '../model/Project';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'epamghio-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() page: number;

  searchRequest = new ProjectSearchRequest('', '', 1);

  projects: Observable<Project[]>;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initProjectsFromObservable(this.searchRequest);

    this.projectService.searchEvent.subscribe(
      request => this.fillRequestAndSearch(request)
    );

    this.route
      .queryParams
      .subscribe(queryParams => {
        if (queryParams['page'])
          this.projectService.searchEvent.emit({pageNumber: queryParams['page']});
      });
  }

  private fillRequestAndSearch(requestPart) {
    this.searchRequest.language = requestPart.hasOwnProperty('language') ? requestPart['language'] : this.searchRequest.language;
    this.searchRequest.filt = requestPart.hasOwnProperty('filt') ? requestPart['filt'] : this.searchRequest.filt;
    this.searchRequest.pageNumber = requestPart['pageNumber'] || this.searchRequest.pageNumber;
    this.initProjectsFromObservable(this.searchRequest);
  }

  private initProjectsFromObservable(filter: ProjectSearchRequest) {
    this.projects = this.projectService.search(filter);
  }
}
