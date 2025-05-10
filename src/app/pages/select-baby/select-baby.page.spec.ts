import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectBabyPage } from './select-baby.page';

describe('SelectBabyPage', () => {
  let component: SelectBabyPage;
  let fixture: ComponentFixture<SelectBabyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBabyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
