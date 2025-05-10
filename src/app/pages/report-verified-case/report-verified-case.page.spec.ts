import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportVerifiedCasePage } from './report-verified-case.page';

describe('ReportVerifiedCasePage', () => {
  let component: ReportVerifiedCasePage;
  let fixture: ComponentFixture<ReportVerifiedCasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVerifiedCasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
