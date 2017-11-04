import {Component, OnInit} from '@angular/core';
import {ProjectDetailInfo} from '../model/ProjectDetailInfo';
import {ProjectService} from "../service/project.service";

@Component({
  selector: 'epamghio-project-detail-info',
  templateUrl: './project-detail-info.component.html',
  styleUrls: ['./project-detail-info.component.css']
})
export class ProjectDetailInfoComponent implements OnInit {
  detail: ProjectDetailInfo = null;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.detail = this.projectService.projectSelectedEvent.subscribe(
      project => {
        this.detail = project;
      }
    );
  }
}
