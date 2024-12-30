import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledTripsPage } from './scheduled-trips.page';

describe('ScheduledTripsPage', () => {
  let component: ScheduledTripsPage;
  let fixture: ComponentFixture<ScheduledTripsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

