import { TestBed } from '@angular/core/testing';

import { TourSpecificationService } from './tour-specification.service';

describe('TourSpecificationService', () => {
  let service: TourSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
