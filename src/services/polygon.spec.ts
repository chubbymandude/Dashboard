import { TestBed } from '@angular/core/testing';
import { Polygon } from './polygon';

describe('Polygon', () => {
  let service: Polygon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Polygon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
