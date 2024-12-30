import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleTripPage } from './schedule-trip.page';

describe('ScheduleTripPage', () => {
  let component: ScheduleTripPage;
  let fixture: ComponentFixture<ScheduleTripPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
