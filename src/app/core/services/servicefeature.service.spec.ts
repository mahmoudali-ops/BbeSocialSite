import { TestBed } from '@angular/core/testing';

import { ServicefeatureService } from './servicefeature.service';

describe('ServicefeatureService', () => {
  let service: ServicefeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicefeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
