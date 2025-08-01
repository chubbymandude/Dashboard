import { TestBed } from '@angular/core/testing';

import { SudokuApi } from './sudoku-api';

describe('SudokuApi', () => {
  let service: SudokuApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
