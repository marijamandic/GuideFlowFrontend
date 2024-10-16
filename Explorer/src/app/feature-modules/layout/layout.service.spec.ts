import { TestBed } from '@angular/core/testing';

import { AppRatingService } from './layout.service';

describe('LayoutService', () => {
  let service: AppRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
