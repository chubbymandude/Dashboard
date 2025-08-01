import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDate } from './current-date';

describe('CurrentDate', () => {
  let component: CurrentDate;
  let fixture: ComponentFixture<CurrentDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
