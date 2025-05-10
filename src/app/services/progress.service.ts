import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private step = 1;

  setStep(value: number) {
    this.step = value;
  }

  getStep(): number {
    return this.step;
  }
}
