
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserServiceService} from '../services/user-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {UserDetail} from '../interfaces/user-detail';
import {SharedStateService} from '../services/shared-state.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  selectedId: number | null = null;
  userDetails: UserDetail | null = null;
  userDetailForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
  private sharedService: SharedStateService
  ) {}

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({
      id: [''],
      name: [''],
      username: [''],
      email: [''],
      phone: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
        geo: this.fb.group({
          lat: [''],
          lng: [''],
        }),
      }),
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
    });

    // Работа selectedId$ и апдейт при изменении
    this.userService.selectedId$.subscribe((id) => {
      this.selectedId = id;
      console.log(`Received ID in Component: ${id}`);

      if (id !== null) {
        this.userService.getUserById(id).subscribe({
          next: (user: UserDetail) => {
            this.userDetails = user;
            console.log('Fetched user:', user);
            this.userDetailForm.patchValue(user);
          },
          error: (err) => console.error('Error fetching user:', err),
          complete: () => console.log('User fetch completed'),
        });
      }
    });
  }

  // Обработчик отправки формы
  onSubmit(): void {
    if (this.selectedId !== null) {
      //  Получение значения форм
      const updatedUser = this.userDetailForm.value;

      // Вызов сервиса апдейта
      this.userService.updateUser(this.selectedId, updatedUser).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.toggleExit();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

  toggleExit(): void {
    this.sharedService.setIsCollapsed(true);
  }
}
