import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectItemCardComponent } from './project-item-card.component';

describe('ProjectItemCardComponent', () => {
  let component: ProjectItemCardComponent;
  let fixture: ComponentFixture<ProjectItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectItemCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
