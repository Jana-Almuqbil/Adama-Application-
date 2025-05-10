import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionairePage } from './questionaire.page';

describe('QuestionairePage', () => {
  let component: QuestionairePage;
  let fixture: ComponentFixture<QuestionairePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
