import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarregamentoService {
  private isLoading = new BehaviorSubject<boolean>(false);
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  setLoading(load: boolean): void {
    this.isLoading.next(load);
    this.loading.emit(load);
  }

  getIsLoading(): BehaviorSubject<boolean> {
    return this.isLoading;
  }
}
