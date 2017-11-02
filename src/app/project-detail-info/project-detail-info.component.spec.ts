import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailInfoComponent } from './project-detail-info.component';

describe('ProjectDetailInfoComponent', () => {
  let component: ProjectDetailInfoComponent;
  let fixture: ComponentFixture<ProjectDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
