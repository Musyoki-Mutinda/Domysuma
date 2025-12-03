import { TestBed } from '@angular/core/testing';

import { SavedPlansService } from './saved-plans.service';

describe('SavedPlansService', () => {
  let service: SavedPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
