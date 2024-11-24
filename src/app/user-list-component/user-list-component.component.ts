import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../services/user-service.service';
import { UserDetail } from '../interfaces/user-detail';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { SharedStateService } from '../services/shared-state.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list-component',
  standalone: true,
  imports: [CommonModule, UserDetailsComponent, CreateUserComponent, FormsModule],
  templateUrl: './user-list-component.component.html',
  styleUrls: ['./user-list-component.component.scss'],
})
export class UserListComponentComponent implements OnInit {
  private UserService = inject(UserServiceService);
  users: UserDetail[] = [];
  searchQuery: string = '';
  filteredUsers: UserDetail[] = [];
  paginatedUsers: UserDetail[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // Default is 10 users per page
  totalPages: number = 0;
  isCollapsed: boolean = true;
  isCreated: boolean = false;

  constructor(private data: UserServiceService, private sharedService: SharedStateService) {}

  ngOnInit() {
    this.loadUsers();
    this.sharedService.isCollapsed$.subscribe((state) => {
      this.isCollapsed = state;
    });
    this.sharedService.isCreated$.subscribe((state) => {
      this.isCreated = state;
    });
  }

  loadUsers() {
    this.UserService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res as UserDetail[];
        this.filteredUsers = [...this.users];
        this.calculateTotalPages();
        this.updatePaginatedUsers();
      },
      error: (error) => console.log('Error fetching', error),
    });
  }

  // Общее количество страниц при обновлении отфильтрованного списка
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }


  toggleCollapsed(id: number) {
    this.isCollapsed = false;
    this.UserService.setSelectedId(id);
    const target = document.getElementById('scrollTarget');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  createUser() {
    this.sharedService.setIsCreate(true);
    const target = document.getElementById('Scrolltargetdown');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  filterUsers() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      // Сбрасываем фильтр при пустом запросе
      this.filteredUsers = [...this.users];
    } else {
      // Фильтруем по адресу почты или имени
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    // Сброс пагинации
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePaginatedUsers();
  }

  deleteUser(id: number) {
    this.UserService.deleteUser(id).subscribe({
      next: () => {
        console.log(`User c id ${id} удален`);
        this.users = this.users.filter((user) => user.id !== id);
        this.filteredUsers = this.filteredUsers.filter((user) => user.id !== id);
        this.UserService.updateUsersInLocalStorage(this.users);
        this.calculateTotalPages();
        this.updatePaginatedUsers();
      },
      error: (err) => console.error('Error удаления ', err),
    });
  }

  synch() {
    // Очистка локального хранилища
    console.log('Local ', localStorage.getItem('users'));
    window.localStorage.removeItem('users');
    window.location.reload(); //Перезагрузим старницу

    // Получения данных из API
    this.UserService.refreshUsersFromAPI().subscribe({
      next: (res: any) => {
        this.users = res as UserDetail[];  // Обновление
        this.filteredUsers = [...this.users]; // Сброс фильтрации
        this.UserService.updateUsersInLocalStorage(this.users); // Обновляем локальное хранилище
        this.calculateTotalPages(); // Пересчет страниц
        this.updatePaginatedUsers(); // Апдейт пагинации
        console.log('Local storage синхронизирован');
      },
      error: (error) => console.error('Error синхронизации API:', error),
    });
  }
}

