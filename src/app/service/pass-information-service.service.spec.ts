import { TestBed } from '@angular/core/testing';

import { PassInformationServiceService } from './pass-information-service.service';

describe('PassInformationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassInformationServiceService = TestBed.get(PassInformationServiceService);
    expect(service).toBeTruthy();
  });
});
