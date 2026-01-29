import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  type: 'input' | 'confirm';
  placeholder?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private configSubject = new BehaviorSubject<DialogConfig | null>(null);
  config$ = this.configSubject.asObservable();

  private resultSubject = new Subject<string | boolean | null>();

  openInput(title: string, message: string, placeholder: string = ''): Subject<string | boolean | null> {
    this.configSubject.next({
      title,
      message,
      type: 'input',
      placeholder
    });
    return this.resultSubject;
  }

  openConfirm(title: string, message: string): Subject<string | boolean | null> {
    this.configSubject.next({
      title,
      message,
      type: 'confirm'
    });
    return this.resultSubject;
  }
  confirm(value: string | boolean) {
    this.resultSubject.next(value);
    this.close();
  }

  cancel() {
    this.resultSubject.next(null);
    this.close();
  }

  private close() {
    this.configSubject.next(null);
    this.resultSubject = new Subject<string | boolean | null>();
  }
}
