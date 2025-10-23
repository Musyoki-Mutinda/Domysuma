import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorrComponent } from './paginator.component';

describe('PaginatorrComponent', () => {
  let component: PaginatorrComponent;
  let fixture: ComponentFixture<PaginatorrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginatorrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
