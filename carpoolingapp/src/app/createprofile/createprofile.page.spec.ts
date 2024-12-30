import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProfilePage } from './createprofile.page';
import { CreateprofilePageModule } from './createprofile.module';

describe('CreateprofilePage', () => {
  let component: CreateprofilePageModule;
  let fixture: ComponentFixture<CreateprofilePageModule>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
