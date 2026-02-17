import { TestBed } from '@angular/core/testing';

import { SocailelemntsService } from './socailelemnts.service';

describe('SocailelemntsService', () => {
  let service: SocailelemntsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocailelemntsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
