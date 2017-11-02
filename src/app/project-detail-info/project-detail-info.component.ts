import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProjectDetailInfo} from '../model/ProjectDetailInfo';

@Component({
  selector: 'epamghio-project-detail-info',
  templateUrl: './project-detail-info.component.html',
  styleUrls: ['./project-detail-info.component.css']
})
export class ProjectDetailInfoComponent implements OnInit {
  @Input() projectObs$: Observable<ProjectDetailInfo>;
  project: ProjectDetailInfo = null;

  constructor() {
  }

  ngOnInit() {
    this.projectObs$.subscribe(
      it => {
        this.project = it;
      }
    );
  }
}
