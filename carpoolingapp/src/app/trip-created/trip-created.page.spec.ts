import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripCreatedPage } from './trip-created.page';

describe('TripCreatedPage', () => {
  let component: TripCreatedPage;
  let fixture: ComponentFixture<TripCreatedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TripCreatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
