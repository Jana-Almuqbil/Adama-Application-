import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifiedCasesPage } from './verified-cases.page';

describe('VerifiedCasesPage', () => {
  let component: VerifiedCasesPage;
  let fixture: ComponentFixture<VerifiedCasesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedCasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
