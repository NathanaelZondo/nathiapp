import { TestBed } from '@angular/core/testing';

import { AddPlayerService } from './add-player.service';

describe('AddPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddPlayerService = TestBed.get(AddPlayerService);
    expect(service).toBeTruthy();
  });
});
