import {Component, OnInit} from '@angular/core';
import {Project} from '../model/Project';
import {Observable} from 'rxjs/Observable';
import {ProjectService} from '../service/project.service';


@Component({
  selector: 'epamghio-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Observable<Project[]> = this.projectService.search({});
  count = this.projects.flatMap(it => it).count(it => true);

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.searchEvent.subscribe(request => {
      console.log(request);
      this.projects = this.projectService.search(request).publishReplay(1).refCount();
      this.count = this.projects.flatMap(it => it).count(it => true);
    });
  }
}
