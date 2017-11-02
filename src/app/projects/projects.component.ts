import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Project} from '../model/Project';
import {Observable} from 'rxjs/Observable';
import {ProjectService} from '../service/project.service';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';
import {ProjectDetailInfo} from '../model/ProjectDetailInfo';


/**
 * Projects separated on 2 parts - before active project detail info and after.
 */
@Component({
  selector: 'epamghio-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  activeProjectName = '';
  activeProject = Observable.empty();
  project: ProjectDetailInfo;
  firstProjects: Observable<Project[]> = this.projectService.search({});
  secondProjects: Observable<Project[]> = Observable.empty();
  count = this.firstProjects.flatMap(it => it).count(it => true);

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.searchEvent.subscribe(request => {
      this.activeProjectName = '';
      this.firstProjects = this.projectService.search(request).publishReplay(1).refCount();
      this.secondProjects = Observable.empty();
      this.count = this.firstProjects.flatMap(it => it).count(it => true);
    });

    this.projectService.activeProjectEvent.subscribe(projectName => {
      this.activeProjectName = this.activeProjectName === projectName ? '' : projectName;
      const allProjects$ = this.getAllProjects();
      this.activeProject = this.getActiveProject(allProjects$, projectName);
      this.divideProjectsOnTwoParts(allProjects$, projectName);
    });
  }

  private getAllProjects() {
    return this.firstProjects
      .flatMap(it => it)
      .concat(this.secondProjects.flatMap(it => it));
  }

  private getActiveProject(allProjects$, projectName): Observable<Project> {
    if (projectName === '')
      return null;

    return allProjects$.find(it => it.name === projectName)
      .map(it => this.projectService.getProjectDetailInfo(it));
  }

  private divideProjectsOnTwoParts(allProjects$, projectName) {
    if (projectName === '') {
      this.firstProjects = allProjects$.toArray();
    } else {
      allProjects$.findIndex(it => it.name === projectName).subscribe(
        indexOfFoundedItem => {
          const countOfItemsBeforeSeparation = this.getCountOfItemsBeforeSeparation(indexOfFoundedItem);
          this.firstProjects = allProjects$.take(countOfItemsBeforeSeparation).toArray();
          this.secondProjects = allProjects$.skip(countOfItemsBeforeSeparation).toArray();
        }
      );
    }
  }

  private getCountOfItemsBeforeSeparation(foundedElement): number {
    return (Math.trunc(foundedElement / 3) + 1) * 3;
  }
}
