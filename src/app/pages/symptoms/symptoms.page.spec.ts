import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymptomsPage } from './symptoms.page';

describe('SymptomsPage', () => {
  let component: SymptomsPage;
  let fixture: ComponentFixture<SymptomsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
