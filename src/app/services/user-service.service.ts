import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetail } from '../interfaces/user-detail';
import { BehaviorSubject, Observable } from 'rxjs';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private http = inject(HttpClient);

  private users: UserDetail[] = [];
  private selectedIdSource = new BehaviorSubject<number | null>(null);
  selectedId$ = this.selectedIdSource.asObservable();

  constructor() {
    this.loadUsersFromLocalStorage();
  }

  private loadUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [];
    }
  }


  private saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Получение пользователей API если локальное хранилище пусто
  getUsers(): Observable<UserDetail[]> {
    if (this.users.length === 0) {
      // If users are not in local storage, fetch from API
      return this.fetchUsersFromAPI();
    } else {
      // Return users from local storage
      return new Observable((observer) => {
        observer.next(this.users);
        observer.complete();
      });
    }
  }

  private fetchUsersFromAPI(): Observable<UserDetail[]> {
    return new Observable((observer) => {
      this.http.get<UserDetail[]>(BASE_URL).subscribe(
        (apiUsers) => {
          this.users = apiUsers;
          this.saveUsersToLocalStorage();
          observer.next(this.users);
          observer.complete();
        },
        (error) => {
          observer.error('Error fetching users from API');
        }
      );
    });
  }

  setSelectedId(id: number): void {
    this.selectedIdSource.next(id);
  }

  getUserById(id: number | null): Observable<any> {
    const url = `${BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  updateUser(id: number, userDetail: UserDetail): Observable<any> {
    const url = `${BASE_URL}/${id}`;
    const newUser = { ...userDetail, id };
    this.users.push(newUser);
    this.saveUsersToLocalStorage();
    this.loadUsersFromLocalStorage();
    return this.http.put<any>(url, userDetail);

  }

  deleteUser(id: number): Observable<void> {
    const url = `${BASE_URL}/${id}`;
    return this.http.delete<void>(url);
  }

  // Методы для апдейта локального хранилища
  updateUsersInLocalStorage(users: UserDetail[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Создание пользователя
  createUser(userDetail: UserDetail): Observable<UserDetail> {
    const newUser = { ...userDetail, id: this.users.length + 1 }; // Assign mock ID
    this.users.push(newUser);
    this.saveUsersToLocalStorage();
    this.loadUsersFromLocalStorage();
    return this.http.post<UserDetail>(BASE_URL, newUser);
  }
  refreshUsersFromAPI(): Observable<UserDetail[]> {
    return new Observable((observer) => {
      this.http.get<UserDetail[]>(BASE_URL).subscribe(
        (apiUsers) => {
          this.users = apiUsers;
          this.saveUsersToLocalStorage();
          observer.next(this.users);
          observer.complete();
        },
        (error) => {
          observer.error('Error refreshing users from API');
        }
      );
    });
  }
}
