import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../model/Project';
import {ProjectService} from "../service/project.service";

@Component({
  selector: 'epamghio-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {

  }

  selectBlock(projectName: string) {
    this.projectService.activeProjectEvent.emit(projectName);
  }
}
