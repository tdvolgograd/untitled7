import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private isCollapsedSource = new BehaviorSubject<boolean>(true); // Initial state
  isCollapsed$ = this.isCollapsedSource.asObservable(); // Observable for components to subscribe to

  private isCreatedSource = new BehaviorSubject<boolean>(false); // Initial state
  isCreated$ = this.isCreatedSource.asObservable(); // Observable for components to subscribe to

  setIsCollapsed(value: boolean): void {
    this.isCollapsedSource.next(value);
  }

  setIsCreate(value: boolean): void {
    this.isCreatedSource.next(value);
  }
}
