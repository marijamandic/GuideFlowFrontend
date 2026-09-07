import { TestBed } from '@angular/core/testing';

import { CartPreviewService } from './cart-preview.service';

describe('CartPreviewService', () => {
  let service: CartPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
