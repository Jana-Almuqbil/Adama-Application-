import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDiagnosisPage } from './edit-diagnosis.page';

describe('EditDiagnosisPage', () => {
  let component: EditDiagnosisPage;
  let fixture: ComponentFixture<EditDiagnosisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiagnosisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
