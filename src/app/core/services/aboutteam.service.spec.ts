import { TestBed } from '@angular/core/testing';

import { AboutteamService } from './aboutteam.service';

describe('AboutteamService', () => {
  let service: AboutteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
