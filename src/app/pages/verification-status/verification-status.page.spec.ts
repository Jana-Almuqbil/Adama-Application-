import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificationStatusPage } from './verification-status.page';

describe('VerificationStatusPage', () => {
  let component: VerificationStatusPage;
  let fixture: ComponentFixture<VerificationStatusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
