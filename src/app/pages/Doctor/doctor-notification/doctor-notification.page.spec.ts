import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorNotificationPage } from './doctor-notification.page';

describe('DoctorNotificationPage', () => {
  let component: DoctorNotificationPage;
  let fixture: ComponentFixture<DoctorNotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
