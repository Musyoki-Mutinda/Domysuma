import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPlanComponent } from './modify-plan.component';

describe('ModifyPlanComponent', () => {
  let component: ModifyPlanComponent;
  let fixture: ComponentFixture<ModifyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
