import { TestBed } from '@angular/core/testing';

import { BrandiamgesService } from './brandiamges.service';

describe('BrandiamgesService', () => {
  let service: BrandiamgesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandiamgesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
