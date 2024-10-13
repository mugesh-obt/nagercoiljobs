import { TestBed } from '@angular/core/testing';

import { AuthPageService } from './auth-page.service';

describe('AuthPageService', () => {
  let service: AuthPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
