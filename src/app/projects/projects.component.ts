import { Component, OnInit } from '@angular/core';
import {ProjectSearchRequest} from '../model/ProjectSearchRequest';
import {ProjectService} from '../service/project.service';
import {Project} from '../model/Project';

@Component({
  selector: 'epamghio-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.initProjectsFromObservable(new ProjectSearchRequest('', ''));

    this.projectService.searchEvent.subscribe(
      filter => this.initProjectsFromObservable(filter)
    );
  }

  private initProjectsFromObservable(filter: ProjectSearchRequest) {
    const temp = [];
    this.projectService.search(filter)
      .subscribe(
        params => temp.push(params),
        error => console.error(error)
      );

    this.projects = temp;
  }
}
