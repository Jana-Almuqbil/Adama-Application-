import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateParentPage } from './update-parent.page';

describe('UpdateParentPage', () => {
  let component: UpdateParentPage;
  let fixture: ComponentFixture<UpdateParentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateParentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
