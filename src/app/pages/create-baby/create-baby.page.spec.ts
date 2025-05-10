import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBabyPage } from './create-baby.page';

describe('CreateBabyPage', () => {
  let component: CreateBabyPage;
  let fixture: ComponentFixture<CreateBabyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBabyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
