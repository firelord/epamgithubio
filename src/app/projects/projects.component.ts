import {Component, OnInit} from '@angular/core';
import {Project} from '../model/Project';
import {ProjectService} from '../service/project.service';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

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

  firstProjects: Project[];
  secondProjects: Project[] = [];

  count = 0;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.initAllProjects({orderByAscUpdatedAt: false});

    this.projectService.search$.subscribe(request => {
      this.activeProjectName = '';
      this.initAllProjects(request);
    });

    this.projectService.activeProjectEvent.subscribe(projectName => {
      this.activeProjectName = this.activeProjectName === projectName ? '' : projectName;
      const allProjects = this.getAllProjects();
      this.divideProjectsOnTwoParts(allProjects, this.activeProjectName);

      const activeProject = this.getActiveProject(allProjects, projectName);
      this.projectService.projectSelectedEvent.emit(activeProject);
    });
  }

  private initAllProjects(request) {
    this.projectService.search(request)
      .subscribe(
        projects => {
          this.divideProjectsOnTwoParts(projects, this.activeProjectName);
          this.count = this.getAllProjects().length;
        }
      );
  }

  private getAllProjects() {
    return this.firstProjects.concat(this.secondProjects);
  }

  private getActiveProject(allProjects, projectName): Project {
    if (projectName === '')
      return null;

    return allProjects.find(it => it.name === projectName);
  }

  private divideProjectsOnTwoParts(allProjects, projectName) {
    if (projectName === '') {
      this.firstProjects = allProjects;
    } else {
      const indexOfFoundedItem = allProjects.findIndex(it => it.name === projectName);
      const countOfItemsBeforeSeparation = this.getCountOfItemsBeforeSeparation(indexOfFoundedItem);
      this.firstProjects = allProjects.slice(0, countOfItemsBeforeSeparation);
      this.secondProjects = allProjects.slice(countOfItemsBeforeSeparation);
    }
  }

  private getCountOfItemsBeforeSeparation(foundedElement): number {
    return (Math.trunc(foundedElement / 3) + 1) * 3;
  }
}
