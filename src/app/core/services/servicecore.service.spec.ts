import { TestBed } from '@angular/core/testing';

import { ServicecoreService } from './servicecore.service';

describe('ServicecoreService', () => {
  let service: ServicecoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicecoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
